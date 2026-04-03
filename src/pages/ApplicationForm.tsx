import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { db, storage } from '../firebase';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useApplicationStore } from '../store/useStore';
import { BackButton } from '../components/BackButton';
import { Button } from '@/components/ui/button';
import { universities } from '../data/universities';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { Check, ChevronsUpDown, Loader2, Award, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { FileUpload } from '@/components/FileUpload';
import { useAuth } from '../contexts/AuthContext';

// Validation Schemas
const step1Schema = z.object({
  applyingFor: z.preprocess((val) => val ?? '', z.string().min(1, 'Please select who you are applying for')),
  fullName: z.preprocess((val) => val ?? '', z.string().min(3, 'Full name is required')),
  dob: z.preprocess((val) => val ?? '', z.string().min(1, 'Date of birth is required')),
  gender: z.preprocess((val) => val ?? '', z.string().min(1, 'Gender is required')),
  phone: z.preprocess((val) => val ?? '', z.string().refine((val) => {
    const intlRegex = /^\+234\d{10}$/;
    const localRegex = /^0(80|90|91)\d{8}$/;
    return intlRegex.test(val) || localRegex.test(val);
  }, 'Invalid phone format. Use +234 (10 digits) or 080/090/091 (11 digits total)')),
  email: z.preprocess((val) => val ?? '', z.string().email('Invalid email address')),
  stateOfOrigin: z.preprocess((val) => val ?? '', z.string().min(1, 'State of origin is required')),
  nin: z.preprocess((val) => val ?? '', z.string().regex(/^\d{11}$/, 'NIN must be exactly 11 digits')),
  nationality: z.literal('Nigerian').default('Nigerian'),
});

const step2Schema = z.object({
  secondarySchool: z.preprocess((val) => val ?? '', z.string().min(3, 'Secondary school name is required')),
  waecResultUrl: z.preprocess((val) => val ?? '', z.string().optional().or(z.literal(''))),
  necoResultUrl: z.preprocess((val) => val ?? '', z.string().optional().or(z.literal(''))),
  undergradDegree: z.preprocess((val) => val ?? '', z.string().optional().or(z.literal(''))),
  gpa: z.preprocess((val) => val ?? '', z.string().optional().or(z.literal(''))),
  fieldOfStudy: z.preprocess((val) => val ?? '', z.string().min(3, 'Field of study is required')),
});

const step3Schema = z.object({
  preferredUniversity: z.preprocess((val) => val ?? '', z.string().min(1, 'Preferred university is required')),
  courseOfInterest: z.preprocess((val) => val ?? '', z.string().min(3, 'Course of interest is required')),
  degreeLevel: z.preprocess((val) => val ?? '', z.string().min(1, 'Degree level is required')),
});

const step4Schema = z.object({
  passportUrl: z.preprocess((val) => val ?? '', z.string().optional().or(z.literal(''))),
  academicCertUrl: z.preprocess((val) => val ?? '', z.string().optional().or(z.literal(''))),
  recommendationUrl: z.preprocess((val) => val ?? '', z.string().optional().or(z.literal(''))),
  personalStatement: z.preprocess((val) => val ?? '', z.string().min(100, 'Personal statement must be at least 100 characters')),
});

const step5Schema = z.object({
  annualIncome: z.preprocess((val) => val ?? '', z.string().min(1, 'Annual income is required')),
  sourceOfFunds: z.preprocess((val) => val ?? '', z.string().min(1, 'Source of funds is required')),
  bankName: z.preprocess((val) => val ?? '', z.string().min(1, 'Bank name is required')),
  accountNumber: z.preprocess((val) => val ?? '', z.string().regex(/^\d{10}$/, 'Account number must be exactly 10 digits')),
  accountName: z.preprocess((val) => val ?? '', z.string().min(3, 'Account name is required')),
});

const step6Schema = z.object({
  referee1Name: z.preprocess((val) => val ?? '', z.string().min(3, 'Referee 1 name is required')),
  referee1Email: z.preprocess((val) => val ?? '', z.string().email('Invalid email for referee 1')),
  referee1Phone: z.preprocess((val) => val ?? '', z.string().refine((val) => {
    const intlRegex = /^\+234\d{10}$/;
    const localRegex = /^0(80|90|91)\d{8}$/;
    return intlRegex.test(val) || localRegex.test(val);
  }, 'Invalid phone format. Use +234 (10 digits) or 080/090/091 (11 digits total)')),
  referee1Relationship: z.preprocess((val) => val ?? '', z.string().min(1, 'Referee 1 relationship is required')),
  referee2Name: z.preprocess((val) => val ?? '', z.string().min(3, 'Referee 2 name is required')),
  referee2Email: z.preprocess((val) => val ?? '', z.string().email('Invalid email for referee 2')),
  referee2Phone: z.preprocess((val) => val ?? '', z.string().refine((val) => {
    const intlRegex = /^\+234\d{10}$/;
    const localRegex = /^0(80|90|91)\d{8}$/;
    return intlRegex.test(val) || localRegex.test(val);
  }, 'Invalid phone format. Use +234 (10 digits) or 080/090/091 (11 digits total)')),
  referee2Relationship: z.preprocess((val) => val ?? '', z.string().min(1, 'Referee 2 relationship is required')),
});

const step7Schema = z.object({
  paymentProofUrl: z.preprocess((val) => val ?? '', z.string().optional().or(z.literal(''))),
  paymentConfirmed: z.boolean().optional().default(false),
  declaration: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the declaration',
  }),
});

const NIGERIAN_STATES = [
  { value: "Abia", label: "Abia" },
  { value: "Adamawa", label: "Adamawa" },
  { value: "Akwa Ibom", label: "Akwa Ibom" },
  { value: "Anambra", label: "Anambra" },
  { value: "Bauchi", label: "Bauchi" },
  { value: "Bayelsa", label: "Bayelsa" },
  { value: "Benue", label: "Benue" },
  { value: "Borno", label: "Borno" },
  { value: "Cross River", label: "Cross River" },
  { value: "Delta", label: "Delta" },
  { value: "Ebonyi", label: "Ebonyi" },
  { value: "Edo", label: "Edo" },
  { value: "Ekiti", label: "Ekiti" },
  { value: "Enugu", label: "Enugu" },
  { value: "Gombe", label: "Gombe" },
  { value: "Imo", label: "Imo" },
  { value: "Jigawa", label: "Jigawa" },
  { value: "Kaduna", label: "Kaduna" },
  { value: "Kano", label: "Kano" },
  { value: "Katsina", label: "Katsina" },
  { value: "Kebbi", label: "Kebbi" },
  { value: "Kogi", label: "Kogi" },
  { value: "Kwara", label: "Kwara" },
  { value: "Lagos", label: "Lagos" },
  { value: "Nasarawa", label: "Nasarawa" },
  { value: "Niger", label: "Niger" },
  { value: "Ogun", label: "Ogun" },
  { value: "Ondo", label: "Ondo" },
  { value: "Osun", label: "Osun" },
  { value: "Oyo", label: "Oyo" },
  { value: "Plateau", label: "Plateau" },
  { value: "Rivers", label: "Rivers" },
  { value: "Sokoto", label: "Sokoto" },
  { value: "Taraba", label: "Taraba" },
  { value: "Yobe", label: "Yobe" },
  { value: "Zamfara", label: "Zamfara" },
  { value: "FCT (Abuja)", label: "FCT (Abuja)" }
];

const INCOME_SOURCES = [
  "Salary/Wages",
  "Business/Entrepreneurship",
  "Freelancing",
  "Agriculture/Farming",
  "Engineering",
  "Trading",
  "Tech",
  "Automation",
  "Content Creator",
  "Investments (Stocks, Crypto, Real Estate)",
  "Artisan/Skilled Work",
  "Government Benefits",
  "Pension",
  "Remittances",
  "Others"
];

const RELATIONSHIP_OPTIONS = [
  "Mother",
  "Brother or sister",
  "Friend",
  "Relative",
  "Others"
];

const NIGERIAN_BANKS = [
  "Access Bank Plc",
  "Zenith Bank Plc",
  "First Bank of Nigeria Limited",
  "Guaranty Trust Bank Plc",
  "United Bank for Africa Plc",
  "Fidelity Bank Plc",
  "Ecobank Nigeria Limited",
  "Stanbic IBTC Bank Limited",
  "Wema Bank Plc",
  "Sterling Bank Plc",
  "Union Bank of Nigeria Plc",
  "Polaris Bank Limited",
  "Keystone Bank Limited",
  "Unity Bank Plc",
  "First City Monument Bank Limited",
  "Citibank Nigeria Limited",
  "Standard Chartered Bank Nigeria",
  "Globus Bank Limited",
  "Titan Trust Bank Limited",
  "Suntrust Bank Nigeria Limited",
  "Providus Bank Limited",
  "Parallex Bank Limited",
  "Signature Bank Limited",
  "Optimus Bank Limited",
  "Premium Trust Bank",
  "Alpha Morgan Bank Limited",
  "Lotus Bank Limited",
  "Heritage Bank Plc",
  "Taj Bank Limited",
  "Jaiz Bank Plc",
  "ALAT by Wema",
  "Kuda Bank",
  "OPay",
  "PalmPay",
  "Moniepoint",
  "V Bank",
  "Sparkle",
  "Rubies Bank",
  "Carbon",
  "Paga",
  "FairMoney",
  "PiggyVest",
  "Cowrywise",
  "Interswitch",
  "Flutterwave",
  "Paystack",
  "Branch",
  "Trove",
  "Renmoney",
  "Eyowo",
  "OneBank",
  "Mint",
  "Risevest",
  "Busha",
  "Quidax",
  "Bundle",
  "Paylater",
  "Korapay",
  "NowNow",
  "GTBank Mobile",
  "Access Mobile",
  "Zenith Mobile",
  "Fidelity Mobile",
  "UBA Mobile",
  "Sterling Mobile",
  "Union Mobile",
  "Polaris Mobile",
  "Keystone Mobile",
  "Unity Mobile",
  "FCMB Mobile",
  "Stanbic IBTC Mobile",
  "Ecobank Mobile",
  "Wema Mobile",
  "Jaiz Mobile"
];

export default function ApplicationForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { data, step, updateData, setStep, nextStep, prevStep } = useApplicationStore();
  const [loading, setLoading] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [activeUploads, setActiveUploads] = useState(0);

  const currentSchema = [step1Schema, step2Schema, step3Schema, step4Schema, step5Schema, step6Schema, step7Schema][step - 1];

    const { register, handleSubmit, formState: { errors, touchedFields }, setValue, watch, trigger, reset: resetForm } = useForm<any>({
    resolver: zodResolver(currentSchema),
    values: data,
    mode: 'all',
  });

  useEffect(() => {
    if (!currentUser) {
      toast.error('Please login to continue');
      navigate('/login');
    }

    // Handle pre-filled university and applyingFor from location.state or sessionStorage
    const state = location.state as { selectedUniversity?: string, applyingFor?: string };
    const storedApplyingFor = sessionStorage.getItem('applyingFor');

    if (state?.selectedUniversity) {
      updateData({ preferredUniversity: state.selectedUniversity });
      setValue('preferredUniversity', state.selectedUniversity);
    }
    
    const applyingForValue = state?.applyingFor || storedApplyingFor;
    if (applyingForValue) {
      updateData({ applyingFor: applyingForValue });
      setValue('applyingFor', applyingForValue);
    }
    
    if (state?.selectedUniversity || state?.applyingFor) {
      // Clear state to prevent re-applying on every render
      window.history.replaceState({}, document.title);
    }
  }, [navigate, currentUser, location.state, updateData, setValue]);

  const getFieldState = (name: string) => {
    const value = watch(name);
    const isDirty = touchedFields[name];
    const hasError = !!errors[name];
    
    if (!isDirty && !value) return "border-slate-200";
    if (hasError) return "border-red-500 focus-visible:ring-red-500";
    if (value && !hasError) return "border-primary-500 focus-visible:ring-primary-500";
    return "border-slate-200";
  };

  const onSubmit = async (formData: any) => {
    updateData(formData);
    if (step < 7) {
      nextStep();
    } else {
      handleFinalSubmit('direct_submission');
    }
  };

  const handleFinalSubmit = async (paymentReference: string) => {
    setLoading(true);
    try {
      if (!currentUser) throw new Error('Not authenticated');

      const finalData = { ...data, ...watch() };

      // Check for duplicate application
      const duplicateQuery = query(
        collection(db, 'applications'),
        where('userId', '==', currentUser.uid),
        where('fullName', '==', finalData.fullName),
        where('nin', '==', finalData.nin),
        where('applyingFor', '==', finalData.applyingFor),
        where('preferredUniversity', '==', finalData.preferredUniversity)
      );
      
      const duplicateSnapshot = await getDocs(duplicateQuery);
      if (!duplicateSnapshot.empty) {
        toast.error('You have already submitted an application with these details.');
        setLoading(false);
        return;
      }

      const generateAppId = () => {
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        return `AD${randomNum}SP`;
      };
      const appId = generateAppId();

      const applicationData = {
        ...finalData,
        applicationId: appId,
        paymentReference,
        paymentStatus: 'pending_verification',
        status: 'Submitted',
        submittedAt: new Date().toISOString(),
        userId: currentUser.uid,
        hasBeenEdited: false,
        amountPaid: '₦5,000'
      };

      await setDoc(doc(db, 'applications', appId), applicationData);
      
      // Clear all form data and reset to step 1
      const { reset } = useApplicationStore.getState();
      reset();
      
      // Clear session storage items that might pre-fill the form
      sessionStorage.removeItem('applyingFor');
      sessionStorage.removeItem('selectedUniversity');
      
      // Reset the react-hook-form state
      resetForm({});
      
      toast.success('Application submitted successfully!');
      navigate('/home');
      
    } catch (error: any) {
      if (error.message?.includes('Missing or insufficient permissions')) {
        handleFirestoreError(error, OperationType.WRITE, `applications/new`);
      }
      console.error("Submission error:", error);
      toast.error(error.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="applyingFor">Who Are You Applying For?</Label>
        <input type="hidden" {...register('applyingFor')} />
        <Select onValueChange={(val) => setValue('applyingFor', val, { shouldValidate: true })} value={watch('applyingFor')}>
          <SelectTrigger className={cn(getFieldState('applyingFor'))}>
            <SelectValue placeholder="Select Relationship" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="myself">Myself</SelectItem>
            <SelectItem value="family">Family Member</SelectItem>
            <SelectItem value="relative">My Relative</SelectItem>
            <SelectItem value="friend">Friend</SelectItem>
            <SelectItem value="others">Others</SelectItem>
          </SelectContent>
        </Select>
        {errors.applyingFor && <p className="text-sm text-red-500">{errors.applyingFor.message as string}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">{t('form.fullname')}</Label>
          <Input 
            id="fullName" 
            {...register('fullName')} 
            className={cn(getFieldState('fullName'))}
          />
          {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message as string}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="dob">{t('form.dob')}</Label>
          <Input 
            id="dob" 
            type="date" 
            {...register('dob')} 
            className={cn(getFieldState('dob'))}
          />
          {errors.dob && <p className="text-sm text-red-500">{errors.dob.message as string}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">{t('form.gender')}</Label>
          <input type="hidden" {...register('gender')} />
          <Select onValueChange={(val) => setValue('gender', val, { shouldValidate: true })} value={watch('gender')}>
            <SelectTrigger className={cn(getFieldState('gender'))}>
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-sm text-red-500">{errors.gender.message as string}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{t('form.phone')}</Label>
          <Input 
            id="phone" 
            type="tel"
            placeholder="+234... or 080..." 
            {...register('phone')} 
            className={cn(getFieldState('phone'))}
            onInput={(e: any) => {
              let val = e.target.value;
              if (val.startsWith('+')) {
                val = '+' + val.slice(1).replace(/\D/g, '').slice(0, 13);
              } else {
                val = val.replace(/\D/g, '').slice(0, 11);
              }
              e.target.value = val;
            }}
            onPaste={(e: any) => {
              e.preventDefault();
              const paste = e.clipboardData.getData('text');
              let sanitized = paste.replace(/[^\d+]/g, '');
              if (sanitized.startsWith('+')) {
                sanitized = '+' + sanitized.slice(1).replace(/\D/g, '').slice(0, 13);
              } else {
                sanitized = sanitized.replace(/\D/g, '').slice(0, 11);
              }
              setValue('phone', sanitized, { shouldValidate: true });
            }}
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone.message as string}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t('form.email')}</Label>
          <Input 
            id="email" 
            type="email" 
            {...register('email')} 
            className={cn(getFieldState('email'))}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message as string}</p>}
        </div>
        <div className="space-y-2 flex flex-col">
          <Label htmlFor="stateOfOrigin" className="mb-1">{t('form.state')}</Label>
          <input type="hidden" {...register('stateOfOrigin')} />
          <Popover open={stateOpen} onOpenChange={setStateOpen}>
            <PopoverTrigger 
              render={
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={stateOpen}
                  className={cn(
                    "w-full justify-between font-normal",
                    getFieldState('stateOfOrigin'),
                    !watch('stateOfOrigin') && "text-muted-foreground"
                  )}
                />
              }
            >
              {watch('stateOfOrigin')
                ? NIGERIAN_STATES.find((state) => state.value === watch('stateOfOrigin'))?.label
                : "Select State"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </PopoverTrigger>
            <PopoverContent className="w-[calc(100vw-2.5rem)] sm:w-[350px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search state..." />
                <CommandList>
                  <CommandEmpty>No state found.</CommandEmpty>
                  <CommandGroup>
                    {NIGERIAN_STATES.map((state) => (
                      <CommandItem
                        key={state.value}
                        value={state.value}
                        onSelect={() => {
                          setValue('stateOfOrigin', state.value, { shouldValidate: true });
                          setStateOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            watch('stateOfOrigin') === state.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {state.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {errors.stateOfOrigin && <p className="text-sm text-red-500">{errors.stateOfOrigin.message as string}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="nin">{t('form.nin')}</Label>
          <Input 
            id="nin" 
            type="tel"
            placeholder="11 digits" 
            {...register('nin')} 
            className={cn(getFieldState('nin'))}
            onInput={(e: any) => {
              e.target.value = e.target.value.replace(/\D/g, '').slice(0, 11);
            }}
            onPaste={(e: any) => {
              e.preventDefault();
              const paste = e.clipboardData.getData('text');
              const sanitized = paste.replace(/\D/g, '').slice(0, 11);
              setValue('nin', sanitized, { shouldValidate: true });
            }}
          />
          {errors.nin && <p className="text-sm text-red-500">{errors.nin.message as string}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="nationality">{t('form.nationality')}</Label>
          <Input id="nationality" value="Nigerian" disabled className="bg-slate-100" {...register('nationality')} />
          <p className="text-xs text-slate-500">{t('form.nationality.locked')}</p>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="secondarySchool">Secondary School Name</Label>
        <Input 
          id="secondarySchool" 
          {...register('secondarySchool')} 
          placeholder="Enter your secondary school name" 
          className={cn(getFieldState('secondarySchool'))}
        />
        {errors.secondarySchool && <p className="text-sm text-red-500">{errors.secondarySchool.message as string}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <input type="hidden" {...register('waecResultUrl')} />
          <FileUpload 
            label="WAEC Result (Optional)" 
            className={cn(getFieldState('waecResultUrl'))}
            onUploadStart={() => setActiveUploads(prev => prev + 1)}
            onUploadError={() => setActiveUploads(prev => Math.max(0, prev - 1))}
            onUploadSuccess={(url) => {
              setActiveUploads(prev => Math.max(0, prev - 1));
              setValue('waecResultUrl', url, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
              updateData({ waecResultUrl: url });
              trigger('waecResultUrl');
            }} 
            value={watch('waecResultUrl')}
          />
          {errors.waecResultUrl && <p className="text-sm text-red-500">{errors.waecResultUrl.message as string}</p>}
        </div>

        <div className="space-y-2">
          <input type="hidden" {...register('necoResultUrl')} />
          <FileUpload 
            label="NECO Result (Optional)" 
            className={cn(getFieldState('necoResultUrl'))}
            onUploadStart={() => setActiveUploads(prev => prev + 1)}
            onUploadError={() => setActiveUploads(prev => Math.max(0, prev - 1))}
            onUploadSuccess={(url) => {
              setActiveUploads(prev => Math.max(0, prev - 1));
              setValue('necoResultUrl', url, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
              updateData({ necoResultUrl: url });
              trigger('necoResultUrl');
            }} 
            value={watch('necoResultUrl')}
          />
          {errors.necoResultUrl && <p className="text-sm text-red-500">{errors.necoResultUrl.message as string}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="undergradDegree">Undergraduate Degree (Optional)</Label>
          <Input 
            id="undergradDegree" 
            {...register('undergradDegree')} 
            placeholder="e.g. B.Sc. Computer Science" 
            className={cn(getFieldState('undergradDegree'))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gpa">GPA (Optional)</Label>
          <Input 
            id="gpa" 
            {...register('gpa')} 
            placeholder="e.g. 4.5/5.0" 
            className={cn(getFieldState('gpa'))}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="fieldOfStudy">Field of Study</Label>
        <Input 
          id="fieldOfStudy" 
          {...register('fieldOfStudy')} 
          placeholder="Enter your intended field of study" 
          className={cn(getFieldState('fieldOfStudy'))}
        />
        {errors.fieldOfStudy && <p className="text-sm text-red-500">{errors.fieldOfStudy.message as string}</p>}
      </div>
    </div>
  );

  const renderStep3 = () => {
    const selectedUniName = watch('preferredUniversity');
    const selectedUni = universities.find(u => u.name === selectedUniName);
    const availableCourses = selectedUni 
      ? selectedUni.programs.flatMap(p => p.courses)
      : [];

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="preferredUniversity">Preferred University</Label>
          <input type="hidden" {...register('preferredUniversity')} />
          <Select 
            onValueChange={(val) => {
              setValue('preferredUniversity', val, { shouldValidate: true });
              setValue('courseOfInterest', '', { shouldValidate: false }); // Reset course when uni changes
            }} 
            value={watch('preferredUniversity')}
          >
            <SelectTrigger className={cn(getFieldState('preferredUniversity'))}>
              <SelectValue placeholder="Select University" />
            </SelectTrigger>
            <SelectContent>
              {universities.map((uni) => (
                <SelectItem key={uni.id} value={uni.name}>
                  {uni.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.preferredUniversity && <p className="text-sm text-red-500">{errors.preferredUniversity.message as string}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="courseOfInterest">Course of Interest</Label>
          <input type="hidden" {...register('courseOfInterest')} />
          <Select 
            onValueChange={(val) => setValue('courseOfInterest', val, { shouldValidate: true })} 
            value={watch('courseOfInterest')}
            disabled={!selectedUniName}
          >
            <SelectTrigger className={cn(getFieldState('courseOfInterest'))}>
              <SelectValue placeholder={selectedUniName ? "Select Course" : "Select University First"} />
            </SelectTrigger>
            <SelectContent>
              {availableCourses.sort().map((course) => (
                <SelectItem key={course} value={course}>
                  {course}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.courseOfInterest && <p className="text-sm text-red-500">{errors.courseOfInterest.message as string}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="degreeLevel">Degree Level</Label>
          <input type="hidden" {...register('degreeLevel')} />
          <Select onValueChange={(val) => setValue('degreeLevel', val, { shouldValidate: true })} value={watch('degreeLevel')}>
            <SelectTrigger className={cn(getFieldState('degreeLevel'))}>
              <SelectValue placeholder="Select Degree Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Undergraduate">Undergraduate</SelectItem>
              <SelectItem value="Masters">Masters</SelectItem>
              <SelectItem value="PhD">PhD</SelectItem>
            </SelectContent>
          </Select>
          {errors.degreeLevel && <p className="text-sm text-red-500">{errors.degreeLevel.message as string}</p>}
        </div>
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <input type="hidden" {...register('passportUrl')} />
        <FileUpload 
          label="Passport Photograph (Optional)" 
          accept="image/*"
          className={cn(getFieldState('passportUrl'))}
          onUploadStart={() => setActiveUploads(prev => prev + 1)}
          onUploadError={() => setActiveUploads(prev => Math.max(0, prev - 1))}
          onUploadSuccess={(url) => {
            setActiveUploads(prev => Math.max(0, prev - 1));
            setValue('passportUrl', url, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            updateData({ passportUrl: url });
            trigger('passportUrl');
          }} 
          value={watch('passportUrl')}
        />
        {errors.passportUrl && <p className="text-sm text-red-500">{errors.passportUrl.message as string}</p>}
      </div>
      <div className="space-y-2">
        <input type="hidden" {...register('academicCertUrl')} />
        <FileUpload 
          label="Academic Certificates (Optional)" 
          className={cn(getFieldState('academicCertUrl'))}
          onUploadStart={() => setActiveUploads(prev => prev + 1)}
          onUploadError={() => setActiveUploads(prev => Math.max(0, prev - 1))}
          onUploadSuccess={(url) => {
            setActiveUploads(prev => Math.max(0, prev - 1));
            setValue('academicCertUrl', url, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            updateData({ academicCertUrl: url });
            trigger('academicCertUrl');
          }} 
          value={watch('academicCertUrl')}
        />
        {errors.academicCertUrl && <p className="text-sm text-red-500">{errors.academicCertUrl.message as string}</p>}
      </div>
      <div className="space-y-2">
        <input type="hidden" {...register('recommendationUrl')} />
        <FileUpload 
          label="Recommendation Letter (Optional)" 
          className={cn(getFieldState('recommendationUrl'))}
          onUploadStart={() => setActiveUploads(prev => prev + 1)}
          onUploadError={() => setActiveUploads(prev => Math.max(0, prev - 1))}
          onUploadSuccess={(url) => {
            setActiveUploads(prev => Math.max(0, prev - 1));
            setValue('recommendationUrl', url, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            updateData({ recommendationUrl: url });
            trigger('recommendationUrl');
          }} 
          value={watch('recommendationUrl')}
        />
        {errors.recommendationUrl && <p className="text-sm text-red-500">{errors.recommendationUrl.message as string}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="personalStatement">Personal Statement</Label>
        <Textarea 
          id="personalStatement" 
          rows={6} 
          {...register('personalStatement')} 
          placeholder="Write your personal statement here..."
          className={cn(getFieldState('personalStatement'))}
          onChange={(e) => {
            register('personalStatement').onChange(e);
            updateData({ personalStatement: e.target.value });
          }}
        />
        {errors.personalStatement && <p className="text-sm text-red-500">{errors.personalStatement.message as string}</p>}
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="annualIncome">Annual Household Income (NGN)</Label>
        <Input 
          id="annualIncome" 
          type="tel" 
          {...register('annualIncome')} 
          placeholder="e.g. 500000" 
          className={cn(getFieldState('annualIncome'))}
          onInput={(e: any) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 15);
          }}
          onPaste={(e: any) => {
            e.preventDefault();
            const paste = e.clipboardData.getData('text');
            const sanitized = paste.replace(/\D/g, '').slice(0, 15);
            setValue('annualIncome', sanitized, { shouldValidate: true });
          }}
        />
        {errors.annualIncome && <p className="text-sm text-red-500">{errors.annualIncome.message as string}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="sourceOfFunds">Source of Funds</Label>
        <input type="hidden" {...register('sourceOfFunds')} />
        <Select onValueChange={(val) => setValue('sourceOfFunds', val, { shouldValidate: true })} value={watch('sourceOfFunds')}>
          <SelectTrigger className={cn(getFieldState('sourceOfFunds'))}>
            <SelectValue placeholder="Select Source" />
          </SelectTrigger>
          <SelectContent>
            {INCOME_SOURCES.map(source => (
              <SelectItem key={source} value={source}>{source}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.sourceOfFunds && <p className="text-sm text-red-500">{errors.sourceOfFunds.message as string}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bankName">Bank Name</Label>
          <input type="hidden" {...register('bankName')} />
          <Select onValueChange={(val) => setValue('bankName', val, { shouldValidate: true })} value={watch('bankName')}>
            <SelectTrigger className={cn(getFieldState('bankName'))}>
              <SelectValue placeholder="Select Bank" />
            </SelectTrigger>
            <SelectContent>
              {NIGERIAN_BANKS.map(bank => (
                <SelectItem key={bank} value={bank}>{bank}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.bankName && <p className="text-sm text-red-500">{errors.bankName.message as string}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="accountNumber">Account Number</Label>
          <Input 
            id="accountNumber" 
            type="tel"
            {...register('accountNumber')} 
            className={cn(getFieldState('accountNumber'))}
            onInput={(e: any) => {
              e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
            }}
            onPaste={(e: any) => {
              e.preventDefault();
              const paste = e.clipboardData.getData('text');
              const sanitized = paste.replace(/\D/g, '').slice(0, 10);
              setValue('accountNumber', sanitized, { shouldValidate: true });
            }}
          />
          {errors.accountNumber && <p className="text-sm text-red-500">{errors.accountNumber.message as string}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="accountName">Account Name</Label>
        <Input 
          id="accountName" 
          {...register('accountName')} 
          className={cn(getFieldState('accountName'))}
        />
        {errors.accountName && <p className="text-sm text-red-500">{errors.accountName.message as string}</p>}
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 border-b pb-2">Referee 1</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="referee1Name">Full Name</Label>
            <Input 
              id="referee1Name" 
              {...register('referee1Name')} 
              className={cn(getFieldState('referee1Name'))}
            />
            {errors.referee1Name && <p className="text-sm text-red-500">{errors.referee1Name.message as string}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="referee1Email">Email Address</Label>
            <Input 
              id="referee1Email" 
              type="email" 
              {...register('referee1Email')} 
              className={cn(getFieldState('referee1Email'))}
            />
            {errors.referee1Email && <p className="text-sm text-red-500">{errors.referee1Email.message as string}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="referee1Phone">Phone Number</Label>
            <Input 
              id="referee1Phone" 
              type="tel"
              {...register('referee1Phone')} 
              placeholder="+234... or 080..."
              className={cn(getFieldState('referee1Phone'))}
              onInput={(e: any) => {
                let val = e.target.value;
                if (val.startsWith('+')) {
                  val = '+' + val.slice(1).replace(/\D/g, '').slice(0, 13);
                } else {
                  val = val.replace(/\D/g, '').slice(0, 11);
                }
                e.target.value = val;
              }}
              onPaste={(e: any) => {
                e.preventDefault();
                const paste = e.clipboardData.getData('text');
                let sanitized = paste.replace(/[^\d+]/g, '');
                if (sanitized.startsWith('+')) {
                  sanitized = '+' + sanitized.slice(1).replace(/\D/g, '').slice(0, 13);
                } else {
                  sanitized = sanitized.replace(/\D/g, '').slice(0, 11);
                }
                setValue('referee1Phone', sanitized, { shouldValidate: true });
              }}
            />
            {errors.referee1Phone && <p className="text-sm text-red-500">{errors.referee1Phone.message as string}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="referee1Relationship">Relationship</Label>
            <input type="hidden" {...register('referee1Relationship')} />
            <Select onValueChange={(val) => setValue('referee1Relationship', val, { shouldValidate: true })} value={watch('referee1Relationship')}>
              <SelectTrigger className={cn(getFieldState('referee1Relationship'))}>
                <SelectValue placeholder="Select Relationship" />
              </SelectTrigger>
              <SelectContent>
                {RELATIONSHIP_OPTIONS.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.referee1Relationship && <p className="text-sm text-red-500">{errors.referee1Relationship.message as string}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 border-b pb-2">Referee 2</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="referee2Name">Full Name</Label>
            <Input 
              id="referee2Name" 
              {...register('referee2Name')} 
              className={cn(getFieldState('referee2Name'))}
            />
            {errors.referee2Name && <p className="text-sm text-red-500">{errors.referee2Name.message as string}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="referee2Email">Email Address</Label>
            <Input 
              id="referee2Email" 
              type="email" 
              {...register('referee2Email')} 
              className={cn(getFieldState('referee2Email'))}
            />
            {errors.referee2Email && <p className="text-sm text-red-500">{errors.referee2Email.message as string}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="referee2Phone">Phone Number</Label>
            <Input 
              id="referee2Phone" 
              type="tel"
              {...register('referee2Phone')} 
              placeholder="+234... or 080..."
              className={cn(getFieldState('referee2Phone'))}
              onInput={(e: any) => {
                let val = e.target.value;
                if (val.startsWith('+')) {
                  val = '+' + val.slice(1).replace(/\D/g, '').slice(0, 13);
                } else {
                  val = val.replace(/\D/g, '').slice(0, 11);
                }
                e.target.value = val;
              }}
              onPaste={(e: any) => {
                e.preventDefault();
                const paste = e.clipboardData.getData('text');
                let sanitized = paste.replace(/[^\d+]/g, '');
                if (sanitized.startsWith('+')) {
                  sanitized = '+' + sanitized.slice(1).replace(/\D/g, '').slice(0, 13);
                } else {
                  sanitized = sanitized.replace(/\D/g, '').slice(0, 11);
                }
                setValue('referee2Phone', sanitized, { shouldValidate: true });
              }}
            />
            {errors.referee2Phone && <p className="text-sm text-red-500">{errors.referee2Phone.message as string}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="referee2Relationship">Relationship</Label>
            <input type="hidden" {...register('referee2Relationship')} />
            <Select onValueChange={(val) => setValue('referee2Relationship', val, { shouldValidate: true })} value={watch('referee2Relationship')}>
              <SelectTrigger className={cn(getFieldState('referee2Relationship'))}>
                <SelectValue placeholder="Select Relationship" />
              </SelectTrigger>
              <SelectContent>
                {RELATIONSHIP_OPTIONS.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.referee2Relationship && <p className="text-sm text-red-500">{errors.referee2Relationship.message as string}</p>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep7 = () => {
    const allData = { ...data, ...watch() };
    
    return (
      <div className="space-y-6">
        <div className="bg-slate-50 p-4 sm:p-6 rounded-lg border border-slate-200 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <h3 className="text-base sm:text-lg font-bold mb-4 border-b pb-2 sticky top-0 bg-slate-50 z-10">Review Your Application</h3>
          
          <div className="space-y-8">
            {/* Personal Information */}
            <section>
              <h4 className="font-bold text-primary-800 text-sm uppercase tracking-wider mb-3">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-xs sm:text-sm">
                <div className="flex flex-col"><span className="font-semibold text-slate-500">Applying For:</span> <span className="capitalize">{allData.applyingFor}</span></div>
                <div className="flex flex-col"><span className="font-semibold text-slate-500">Full Name:</span> <span>{allData.fullName}</span></div>
                <div className="flex flex-col"><span className="font-semibold text-slate-500">Email:</span> <span>{allData.email}</span></div>
                <div className="flex flex-col"><span className="font-semibold text-slate-500">Phone:</span> <span>{allData.phone}</span></div>
                <div className="flex flex-col"><span className="font-semibold text-slate-500">Date of Birth:</span> <span>{allData.dob}</span></div>
                <div className="flex flex-col"><span className="font-semibold text-slate-500">Gender:</span> <span>{allData.gender}</span></div>
                <div className="flex flex-col"><span className="font-semibold text-slate-500">State of Origin:</span> <span>{allData.stateOfOrigin}</span></div>
                <div className="flex flex-col"><span className="font-semibold text-slate-500">NIN:</span> <span>{allData.nin}</span></div>
              </div>
            </section>

            {/* Academic Background */}
            <section className="border-t pt-4">
              <h4 className="font-bold text-primary-800 text-sm uppercase tracking-wider mb-3">Academic Background</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-xs sm:text-sm">
                <div className="flex flex-col"><span className="font-semibold text-slate-500">Secondary School:</span> <span>{allData.secondarySchool}</span></div>
                <div className="flex flex-col"><span className="font-semibold text-slate-500">Field of Study:</span> <span>{allData.fieldOfStudy}</span></div>
                {allData.undergradDegree && <div className="flex flex-col"><span className="font-semibold text-slate-500">Undergrad Degree:</span> <span>{allData.undergradDegree}</span></div>}
                {allData.gpa && <div className="flex flex-col"><span className="font-semibold text-slate-500">GPA:</span> <span>{allData.gpa}</span></div>}
              </div>
            </section>

            {/* Scholarship Selection */}
            <section className="border-t pt-4">
              <h4 className="font-bold text-primary-800 text-sm uppercase tracking-wider mb-3">Scholarship Selection</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-xs sm:text-sm">
                <div className="flex flex-col"><span className="font-semibold text-slate-500">University:</span> <span>{allData.preferredUniversity}</span></div>
                <div className="flex flex-col"><span className="font-semibold text-slate-500">Course:</span> <span>{allData.courseOfInterest}</span></div>
                <div className="flex flex-col"><span className="font-semibold text-slate-500">Degree Level:</span> <span>{allData.degreeLevel}</span></div>
              </div>
            </section>

            {/* Documents */}
            <section className="border-t pt-4">
              <h4 className="font-bold text-primary-800 text-sm uppercase tracking-wider mb-3">Documents & Statement</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-xs sm:text-sm mb-4">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-600" /> <span className="font-semibold text-slate-500">Passport Photo</span></div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-600" /> <span className="font-semibold text-slate-500">Academic Certificates</span></div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-600" /> <span className="font-semibold text-slate-500">Recommendation Letter</span></div>
              </div>
              <div className="flex flex-col text-xs sm:text-sm">
                <span className="font-semibold text-slate-500 mb-1">Personal Statement:</span>
                <p className="text-slate-600 line-clamp-3 bg-white p-2 rounded border italic">
                  {allData.personalStatement}
                </p>
              </div>
            </section>

            {/* Financial Information */}
            <section className="border-t pt-4">
              <h4 className="font-bold text-primary-800 text-sm uppercase tracking-wider mb-3">Financial Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-xs sm:text-sm">
                <div className="flex flex-col"><span className="font-semibold text-slate-500">Annual Income:</span> <span>₦{Number(allData.annualIncome).toLocaleString()}</span></div>
                <div className="flex flex-col"><span className="font-semibold text-slate-500">Source of Funds:</span> <span>{allData.sourceOfFunds}</span></div>
                <div className="flex flex-col"><span className="font-semibold text-slate-500">Bank Name:</span> <span>{allData.bankName}</span></div>
                <div className="flex flex-col"><span className="font-semibold text-slate-500">Account:</span> <span>{allData.accountNumber} ({allData.accountName})</span></div>
              </div>
            </section>

            {/* References */}
            <section className="border-t pt-4">
              <h4 className="font-bold text-primary-800 text-sm uppercase tracking-wider mb-3">References</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
                <div className="bg-white p-3 rounded border">
                  <p className="font-bold text-slate-700 mb-1">Referee 1</p>
                  <p className="text-slate-600">{allData.referee1Name}</p>
                  <p className="text-slate-500 text-[10px]">{allData.referee1Relationship}</p>
                  <p className="text-slate-500 text-[10px]">{allData.referee1Email}</p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <p className="font-bold text-slate-700 mb-1">Referee 2</p>
                  <p className="text-slate-600">{allData.referee2Name}</p>
                  <p className="text-slate-500 text-[10px]">{allData.referee2Relationship}</p>
                  <p className="text-slate-500 text-[10px]">{allData.referee2Email}</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-primary-50 p-6 rounded-xl border border-primary-200 space-y-4">
          <h3 className="font-bold text-primary-800 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Application Fee Payment
          </h3>
          <div className="bg-white p-4 rounded-lg border border-primary-100 text-sm space-y-2">
            <p className="text-slate-600">Please pay the application fee of <span className="font-bold text-primary-700">₦5,000</span> to the account below:</p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <span className="text-slate-500">Bank:</span>
              <span className="font-bold">Opay</span>
              <span className="text-slate-500">Account Name:</span>
              <span className="font-bold">Aliko Dangote Scholarship Foundation</span>
              <span className="text-slate-500">Account Number:</span>
              <div className="flex items-center gap-2">
                <span className="font-bold">1234567890</span>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-primary-600 hover:text-primary-700 hover:bg-primary-100"
                  onClick={() => {
                    navigator.clipboard.writeText('1234567890');
                    toast.success('Account number copied to clipboard');
                  }}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <input type="hidden" {...register('paymentProofUrl')} />
            <FileUpload 
              label="Upload Payment Screenshot (Optional)" 
              accept="image/*"
              onUploadStart={() => setActiveUploads(prev => prev + 1)}
              onUploadError={() => setActiveUploads(prev => Math.max(0, prev - 1))}
              onUploadSuccess={(url) => {
                setActiveUploads(prev => Math.max(0, prev - 1));
                setValue('paymentProofUrl', url, { shouldValidate: true });
                updateData({ paymentProofUrl: url });
              }} 
              value={watch('paymentProofUrl')}
            />
            <p className="text-xs text-slate-500 italic">You can submit your application now and upload proof of payment later if needed.</p>
            {errors.paymentProofUrl && <p className="text-sm text-red-500">{errors.paymentProofUrl.message as string}</p>}
          </div>

          <div className="flex items-start space-x-3 pt-2">
            <Checkbox 
              id="paymentConfirmed" 
              checked={watch('paymentConfirmed')}
              onCheckedChange={(checked) => setValue('paymentConfirmed', checked as boolean, { shouldValidate: true })}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="paymentConfirmed" className="font-medium cursor-pointer text-sm text-primary-800">
                I understand that my application will only be processed after payment of ₦5,000 is verified.
              </Label>
              {errors.paymentConfirmed && <p className="text-sm text-red-500">{errors.paymentConfirmed.message as string}</p>}
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="font-semibold text-yellow-800 mb-2">Final Declaration</h4>
          <p className="text-yellow-700 text-sm">Please review all information above. By submitting, you certify that all information is true and correct to the best of your knowledge.</p>
        </div>

        <div className="flex items-start space-x-3 pt-4">
          <Checkbox 
            id="declaration" 
            checked={watch('declaration')}
            onCheckedChange={(checked) => setValue('declaration', checked as boolean, { shouldValidate: true })}
          />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="declaration" className="font-medium cursor-pointer">
              I solemnly declare that the information provided is true and correct.
            </Label>
            <p className="text-sm text-slate-500">
              I understand that any false statement may lead to disqualification or withdrawal of the scholarship.
            </p>
            {errors.declaration && <p className="text-sm text-red-500 mt-1">{errors.declaration.message as string}</p>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <BackButton />
      <div className="mb-6 sm:mb-10 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-800 mb-2">Scholarship Application</h1>
        <p className="text-sm sm:text-base text-slate-600">Complete all steps to submit your application.</p>
      </div>

      <div className="mb-6 sm:mb-10">
        <div className="flex justify-between items-center mb-6">
          {[1, 2, 3, 4, 5, 6, 7].map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                  step === s ? "bg-primary-700 text-white scale-110 ring-4 ring-primary-100" : 
                  step > s ? "bg-primary-100 text-primary-700" : "bg-slate-100 text-slate-400"
                )}
              >
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              <span className={cn(
                "text-[10px] font-medium hidden sm:block",
                step === s ? "text-primary-700" : "text-slate-400"
              )}>
                Step {s}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs sm:text-sm font-medium text-slate-500 mb-2">
          <span>{Math.round((step / 7) * 100)}% Completed</span>
        </div>
        <Progress value={(step / 7) * 100} className="h-1.5 sm:h-2 bg-slate-100" />
      </div>

      <div className="bg-white shadow-md sm:shadow-sm border border-slate-200 rounded-xl p-4 sm:p-6 md:p-8 overflow-hidden">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-5 sm:mb-6 pb-2 border-b">
          {t(`form.step${step}`)}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
              {step === 4 && renderStep4()}
              {step === 5 && renderStep5()}
              {step === 6 && renderStep6()}
              {step === 7 && renderStep7()}
            </motion.div>
          </AnimatePresence>

        <div className="flex flex-col sm:flex-row justify-between mt-8 pt-6 border-t border-slate-100 gap-4">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto order-2 sm:order-1"
            onClick={() => {
              updateData(watch());
              prevStep();
            }}
            disabled={step === 1 || loading}
          >
            {t('form.prev')}
          </Button>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 order-1 sm:order-2">
            <Button
              type="button"
              variant="ghost"
              className="w-full sm:w-auto"
              onClick={() => {
                updateData(watch());
                toast.success('Progress saved locally!');
              }}
              disabled={loading}
            >
              {t('form.save')}
            </Button>
            
            {step === 7 ? (
              <Button 
                type="submit" 
                className="w-full sm:w-auto bg-primary-700 hover:bg-primary-800" 
                disabled={loading || activeUploads > 0}
              >
                {activeUploads > 0 ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : loading ? 'Processing...' : 'Submit Application'}
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="w-full sm:w-auto bg-primary-700 hover:bg-primary-800" 
                disabled={loading || activeUploads > 0}
              >
                {activeUploads > 0 ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : loading ? 'Processing...' : t('form.next')}
              </Button>
            )}
          </div>
        </div>
        </form>
      </div>
    </div>
  );
}
