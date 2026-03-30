import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ApplicationData {
  // Step 1
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
        declaration: false,
      },
      step: 1,
      updateData: (newData) => set((state) => ({ data: { ...state.data, ...newData } })),
      setStep: (step) => set({ step }),
      nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 5) })),
      prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
      reset: () => set({ 
        data: { 
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
