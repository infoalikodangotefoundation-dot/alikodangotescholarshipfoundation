import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ApplicationData {
  // Step 1
  applyingFor: string;
  fullName: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  stateOfOrigin: string;
  nin: string;
  nationality: string;
  
  // Step 2
  secondarySchool: string;
  waecResultUrl: string;
  necoResultUrl: string;
  undergradDegree: string;
  gpa: string;
  fieldOfStudy: string;
  
  // Step 3
  preferredUniversity: string;
  courseOfInterest: string;
  degreeLevel: string;
  
  // Step 4
  passportUrl: string;
  academicCertUrl: string;
  recommendationUrl: string;
  personalStatement: string;
  
  // Step 5
  annualIncome: string;
  sourceOfFunds: string;
  bankName: string;
  accountNumber: string;
  accountName: string;

  // Step 6
  referee1Name: string;
  referee1Email: string;
  referee1Phone: string;
  referee1Relationship: string;
  referee2Name: string;
  referee2Email: string;
  referee2Phone: string;
  referee2Relationship: string;

  // Step 7
  declaration: boolean;
}

interface ApplicationState {
  data: Partial<ApplicationData>;
  step: number;
  updateData: (newData: Partial<ApplicationData>) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set) => ({
      data: {
        applyingFor: '',
        fullName: '',
        dob: '',
        gender: '',
        phone: '',
        email: '',
        stateOfOrigin: '',
        nin: '',
        nationality: 'Nigerian',
        secondarySchool: '',
        waecResultUrl: '',
        necoResultUrl: '',
        undergradDegree: '',
        gpa: '',
        fieldOfStudy: '',
        preferredUniversity: '',
        courseOfInterest: '',
        degreeLevel: '',
        passportUrl: '',
        academicCertUrl: '',
        recommendationUrl: '',
        personalStatement: '',
        annualIncome: '',
        sourceOfFunds: '',
        bankName: '',
        accountNumber: '',
        accountName: '',
        referee1Name: '',
        referee1Email: '',
        referee1Phone: '',
        referee1Relationship: '',
        referee2Name: '',
        referee2Email: '',
        referee2Phone: '',
        referee2Relationship: '',
        declaration: false,
      },
      step: 1,
      updateData: (newData) => set((state) => ({ data: { ...state.data, ...newData } })),
      setStep: (step) => set({ step }),
      nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 7) })),
      prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
      reset: () => set({ 
        data: { 
          applyingFor: '',
          fullName: '',
          dob: '',
          gender: '',
          phone: '',
          email: '',
          stateOfOrigin: '',
          nin: '',
          nationality: 'Nigerian',
          secondarySchool: '',
          waecResultUrl: '',
          necoResultUrl: '',
          undergradDegree: '',
          gpa: '',
          fieldOfStudy: '',
          preferredUniversity: '',
          courseOfInterest: '',
          degreeLevel: '',
          passportUrl: '',
          academicCertUrl: '',
          recommendationUrl: '',
          personalStatement: '',
          annualIncome: '',
          sourceOfFunds: '',
          bankName: '',
          accountNumber: '',
          accountName: '',
          referee1Name: '',
          referee1Email: '',
          referee1Phone: '',
          referee1Relationship: '',
          referee2Name: '',
          referee2Email: '',
          referee2Phone: '',
          referee2Relationship: '',
          declaration: false,
        }, 
        step: 1 
      }),
    }),
    {
      name: 'dangote-scholarship-storage',
    }
  )
);
