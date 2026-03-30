import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { db, storage } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
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
import { AIAssistant } from '@/components/AIAssistant';
import { toast } from 'sonner';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { FileUpload } from '@/components/FileUpload';
import { useAuth } from '../contexts/AuthContext';

// Validation Schemas
const step1Schema = z.object({
  fullName: z.preprocess((val) => val ?? '', z.string().min(3, 'Full name is required')),
  dob: z.preprocess((val) => val ?? '', z.string().min(1, 'Date of birth is required')),
  gender: z.preprocess((val) => val ?? '', z.string().min(1, 'Gender is required')),
  phone: z.preprocess((val) => val ?? '', z.string().regex(/^\+234\d{10}$/, 'Phone must start with +234 followed by 10 digits')),
  email: z.preprocess((val) => val ?? '', z.string().email('Invalid email address')),
  stateOfOrigin: z.preprocess((val) => val ?? '', z.string().min(1, 'State of origin is required')),
  nin: z.preprocess((val) => val ?? '', z.string().length(11, 'NIN must be exactly 11 digits')),
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
  passportUrl: z.preprocess((val) => val ?? '', z.string().min(1, 'Passport photograph is required').url('Valid URL required for passport photograph')),
  academicCertUrl: z.preprocess((val) => val ?? '', z.string().min(1, 'Academic certificates are required').url('Valid URL required for academic certificates')),
  recommendationUrl: z.preprocess((val) => val ?? '', z.string().min(1, 'Recommendation letter is required').url('Valid URL required for recommendation letter')),
  personalStatement: z.preprocess((val) => val ?? '', z.string().min(100, 'Personal statement must be at least 100 characters')),
});

const step5Schema = z.object({
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

export default function ApplicationForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { data, step, updateData, setStep, nextStep, prevStep } = useApplicationStore();
  const [loading, setLoading] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      toast.error('Please login to continue');
      navigate('/login');
    }

    // Handle pre-filled university from location.state
    const state = location.state as { selectedUniversity?: string };
    if (state?.selectedUniversity && !data.preferredUniversity) {
      updateData({ ...data, preferredUniversity: state.selectedUniversity });
      setValue('preferredUniversity', state.selectedUniversity);
    }
  }, [navigate, currentUser, location.state, data.preferredUniversity, updateData]);

  const currentSchema = [step1Schema, step2Schema, step3Schema, step4Schema, step5Schema][step - 1];

  const { register, handleSubmit, formState: { errors }, setValue, watch, trigger } = useForm<any>({
    resolver: zodResolver(currentSchema),
    values: data,
    mode: 'onChange',
  });

  const onSubmit = async (formData: any) => {
    updateData(formData);
    if (step < 5) {
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
      
      const { reset } = useApplicationStore.getState();
      reset();
      
      toast.success('Application submitted successfully!');
      navigate('/application-status');
      
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">{t('form.fullname')}</Label>
          <Input id="fullName" {...register('fullName')} />
          {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message as string}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="dob">{t('form.dob')}</Label>
          <Input id="dob" type="date" {...register('dob')} />
          {errors.dob && <p className="text-sm text-red-500">{errors.dob.message as string}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">{t('form.gender')}</Label>
          <input type="hidden" {...register('gender')} />
          <Select onValueChange={(val) => setValue('gender', val, { shouldValidate: true })} value={watch('gender')}>
            <SelectTrigger>
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
          <Input id="phone" placeholder="+234..." {...register('phone')} />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone.message as string}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t('form.email')}</Label>
          <Input id="email" type="email" {...register('email')} />
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
          <Input id="nin" placeholder="11 digits" {...register('nin')} />
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
        <Input id="secondarySchool" {...register('secondarySchool')} placeholder="Enter your secondary school name" />
        {errors.secondarySchool && <p className="text-sm text-red-500">{errors.secondarySchool.message as string}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <input type="hidden" {...register('waecResultUrl')} />
          <FileUpload 
            label="WAEC Result (Optional)" 
            onUploadSuccess={(url) => setValue('waecResultUrl', url, { shouldValidate: true })} 
            value={watch('waecResultUrl')}
          />
          {errors.waecResultUrl && <p className="text-sm text-red-500">{errors.waecResultUrl.message as string}</p>}
        </div>

        <div className="space-y-2">
          <input type="hidden" {...register('necoResultUrl')} />
          <FileUpload 
            label="NECO Result (Optional)" 
            onUploadSuccess={(url) => setValue('necoResultUrl', url, { shouldValidate: true })} 
            value={watch('necoResultUrl')}
          />
          {errors.necoResultUrl && <p className="text-sm text-red-500">{errors.necoResultUrl.message as string}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="undergradDegree">Undergraduate Degree (Optional)</Label>
          <Input id="undergradDegree" {...register('undergradDegree')} placeholder="e.g. B.Sc. Computer Science" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gpa">GPA (Optional)</Label>
          <Input id="gpa" {...register('gpa')} placeholder="e.g. 4.5/5.0" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="fieldOfStudy">Field of Study</Label>
        <Input id="fieldOfStudy" {...register('fieldOfStudy')} placeholder="Enter your intended field of study" />
        {errors.fieldOfStudy && <p className="text-sm text-red-500">{errors.fieldOfStudy.message as string}</p>}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="preferredUniversity">Preferred University</Label>
        <input type="hidden" {...register('preferredUniversity')} />
        <Select onValueChange={(val) => setValue('preferredUniversity', val, { shouldValidate: true })} value={watch('preferredUniversity')}>
          <SelectTrigger>
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
        <Input id="courseOfInterest" {...register('courseOfInterest')} />
        {errors.courseOfInterest && <p className="text-sm text-red-500">{errors.courseOfInterest.message as string}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="degreeLevel">Degree Level</Label>
        <input type="hidden" {...register('degreeLevel')} />
        <Select onValueChange={(val) => setValue('degreeLevel', val, { shouldValidate: true })} value={watch('degreeLevel')}>
          <SelectTrigger>
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

  const renderStep4 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <input type="hidden" {...register('passportUrl')} />
        <FileUpload 
          label="Passport Photograph" 
          accept="image/*"
          onUploadSuccess={(url) => setValue('passportUrl', url, { shouldValidate: true })} 
          value={watch('passportUrl')}
        />
        {errors.passportUrl && <p className="text-sm text-red-500">{errors.passportUrl.message as string}</p>}
      </div>
      <div className="space-y-2">
        <input type="hidden" {...register('academicCertUrl')} />
        <FileUpload 
          label="Academic Certificates" 
          onUploadSuccess={(url) => setValue('academicCertUrl', url, { shouldValidate: true })} 
          value={watch('academicCertUrl')}
        />
        {errors.academicCertUrl && <p className="text-sm text-red-500">{errors.academicCertUrl.message as string}</p>}
      </div>
      <div className="space-y-2">
        <input type="hidden" {...register('recommendationUrl')} />
        <FileUpload 
          label="Recommendation Letter" 
          onUploadSuccess={(url) => setValue('recommendationUrl', url, { shouldValidate: true })} 
          value={watch('recommendationUrl')}
        />
        {errors.recommendationUrl && <p className="text-sm text-red-500">{errors.recommendationUrl.message as string}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="personalStatement">Personal Statement</Label>
        <input type="hidden" {...register('personalStatement')} />
        <Textarea 
          id="personalStatement" 
          rows={6} 
          {...register('personalStatement')} 
          placeholder="Write your personal statement here..."
        />
        {errors.personalStatement && <p className="text-sm text-red-500">{errors.personalStatement.message as string}</p>}
        
        <AIAssistant 
          currentText={watch('personalStatement') || ''} 
          onApplySuggestion={(text) => setValue('personalStatement', text, { shouldValidate: true })} 
        />
      </div>
    </div>
  );

  const renderStep5 = () => {
    const allData = { ...data, ...watch() };
    
    return (
      <div className="space-y-6">
        <div className="bg-slate-50 p-4 sm:p-6 rounded-lg border border-slate-200">
          <h3 className="text-base sm:text-lg font-bold mb-4 border-b pb-2">Review Your Application</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 sm:gap-y-4 gap-x-8 text-xs sm:text-sm">
            <div className="flex flex-col sm:flex-row sm:gap-2"><span className="font-semibold text-slate-500">Full Name:</span> <span className="break-words">{allData.fullName}</span></div>
            <div className="flex flex-col sm:flex-row sm:gap-2"><span className="font-semibold text-slate-500">Email:</span> <span className="break-words">{allData.email}</span></div>
            <div className="flex flex-col sm:flex-row sm:gap-2"><span className="font-semibold text-slate-500">Phone:</span> <span>{allData.phone}</span></div>
            <div className="flex flex-col sm:flex-row sm:gap-2"><span className="font-semibold text-slate-500">NIN:</span> <span>{allData.nin}</span></div>
            <div className="flex flex-col sm:flex-row sm:gap-2"><span className="font-semibold text-slate-500">University:</span> <span className="break-words">{allData.preferredUniversity}</span></div>
            <div className="flex flex-col sm:flex-row sm:gap-2"><span className="font-semibold text-slate-500">Course:</span> <span className="break-words">{allData.courseOfInterest}</span></div>
            <div className="flex flex-col sm:flex-row sm:gap-2"><span className="font-semibold text-slate-500">Degree:</span> <span>{allData.degreeLevel}</span></div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="font-semibold text-yellow-800 mb-2">Application Submission</h4>
          <p className="text-yellow-700 text-sm">Review your details carefully. Once submitted, you can track your application status in your dashboard.</p>
        </div>

        <div className="flex items-start space-x-3 pt-4">
          <Checkbox 
            id="declaration" 
            checked={watch('declaration')}
            onCheckedChange={(checked) => setValue('declaration', checked as boolean, { shouldValidate: true })}
          />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="declaration" className="font-medium">
              I confirm all information provided is accurate.
            </Label>
            <p className="text-sm text-slate-500">
              By checking this box, you agree to our Terms and Conditions and confirm that you are a Nigerian citizen.
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
        <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2">Scholarship Application</h1>
        <p className="text-sm sm:text-base text-slate-600">Complete all steps to submit your application.</p>
      </div>

      <div className="mb-6 sm:mb-10">
        <div className="flex justify-between text-xs sm:text-sm font-medium text-slate-500 mb-2">
          <span>Step {step} of 5</span>
          <span>{step * 20}% Completed</span>
        </div>
        <Progress value={step * 20} className="h-1.5 sm:h-2 bg-slate-100" />
      </div>

      <div className="bg-white shadow-md sm:shadow-sm border border-slate-200 rounded-xl p-4 sm:p-6 md:p-8">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-5 sm:mb-6 pb-2 border-b">
          {t(`form.step${step}`)}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}

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
              
              <Button type="submit" className="w-full sm:w-auto bg-green-700 hover:bg-green-800" disabled={loading}>
                {loading ? 'Processing...' : step === 5 ? 'Submit Application' : t('form.next')}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
