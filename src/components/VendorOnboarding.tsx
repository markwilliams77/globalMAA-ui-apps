import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Stethoscope, 
  FileCheck, 
  UserCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  CloudUpload,
  Globe,
  MapPin,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import { cn } from '../lib/utils';
import IndianPhoneInput from './IndianPhoneInput';
import { isValidIndianPhoneDigits } from '../utils/phone';
import {
  vendorOnboardingApi,
  type VendorDocumentType,
  type VendorOnboardingPayload,
  type VendorOrgType,
  type VendorPlan,
} from '../utils/vendorOnboarding';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: any;
}

const STEPS: Step[] = [
  { id: 1, title: 'Identity', description: 'Organization profile', icon: Building2 },
  { id: 2, title: 'Expertise', description: 'Medical specializations', icon: Stethoscope },
  { id: 3, title: 'Documents', description: 'Authenticity verification', icon: FileCheck },
  { id: 4, title: 'Success Plan', description: 'Growth tier selection', icon: Zap },
  { id: 5, title: 'Verification', description: 'Compliance review', icon: ShieldCheck },
  { id: 6, title: 'Registry', description: 'Node activation', icon: Globe },
];

const DOCUMENTS: Array<{ type: VendorDocumentType; label: string; icon: any }> = [
  { type: 'business_license', label: 'Business License / Registration', icon: FileCheck },
  { type: 'moh_accreditation', label: 'MOH Accreditation Certificate', icon: ShieldCheck },
  { type: 'tax_identification', label: 'Tax Identification Document', icon: FileCheck },
];

const ONBOARDING_STORAGE_KEY = 'gmaa_vendor_onboarding';

type UploadedDocumentState = Record<VendorDocumentType, { fileName: string; fileKey: string } | null>;

interface SavedOnboardingState {
  vendorId: string | null;
  currentStep: number;
  formData: VendorOnboardingPayload;
  documents: UploadedDocumentState;
  submitted: boolean;
}

const emptyDocuments: UploadedDocumentState = {
  business_license: null,
  moh_accreditation: null,
  tax_identification: null,
};

const emptyFormData: VendorOnboardingPayload = {
  orgName: '',
  address: '',
  email: '',
  contactPerson: '',
  contactNumber: '',
  orgType: 'Hospital',
  specialties: [],
  plan: 'Standard',
};

const getSavedOnboarding = (): SavedOnboardingState | null => {
  try {
    const saved = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) as SavedOnboardingState : null;

    if (parsed && !parsed.vendorId && parsed.currentStep > 1) {
      window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

const getRequestErrorMessage = (error: unknown, fallback: string) => {
  const responseMessage = (error as { response?: { data?: { message?: string; error?: string } } }).response?.data;
  return responseMessage?.message || responseMessage?.error || (error instanceof Error ? error.message : fallback);
};

const loadRazorpayCheckout = () => {
  return new Promise<void>((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Unable to load Razorpay checkout.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Unable to load Razorpay checkout.'));
    document.body.appendChild(script);
  });
};

export default function VendorOnboarding({ onComplete, onCancel }: { onComplete: () => void, onCancel: () => void }) {
  const savedOnboarding = getSavedOnboarding();
  const [currentStep, setCurrentStep] = useState(savedOnboarding?.submitted ? 5 : savedOnboarding?.currentStep ?? 1);
  const [vendorId, setVendorId] = useState<string | null>(savedOnboarding?.vendorId ?? null);
  const [documents, setDocuments] = useState<UploadedDocumentState>(savedOnboarding?.documents ?? emptyDocuments);
  const [applicationSubmitted, setApplicationSubmitted] = useState(savedOnboarding?.submitted ?? false);
  const [uploadingDocument, setUploadingDocument] = useState<VendorDocumentType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isCheckingSavedDraft, setIsCheckingSavedDraft] = useState(Boolean(savedOnboarding?.vendorId));
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState<VendorOnboardingPayload>(savedOnboarding?.formData ?? emptyFormData);
  const contactNumberIsValid = isValidIndianPhoneDigits(formData.contactNumber);
  const documentsComplete = DOCUMENTS.every((doc) => documents[doc.type]);
  const identityComplete = Boolean(
    formData.orgName.trim() &&
    formData.address.trim() &&
    formData.email.trim() &&
    formData.contactPerson.trim() &&
    contactNumberIsValid
  );

  const getPayload = (): VendorOnboardingPayload => ({
    orgName: formData.orgName.trim(),
    address: formData.address.trim(),
    email: formData.email.trim(),
    contactPerson: formData.contactPerson.trim(),
    contactNumber: formData.contactNumber,
    orgType: formData.orgType,
    specialties: formData.specialties,
    plan: formData.plan,
  });

  useEffect(() => {
    const stateToSave: SavedOnboardingState = {
      vendorId,
      currentStep,
      formData: getPayload(),
      documents,
      submitted: applicationSubmitted,
    };

    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(stateToSave));
  }, [applicationSubmitted, currentStep, documents, formData, vendorId]);

  useEffect(() => {
    if (!vendorId) {
      setIsCheckingSavedDraft(false);
      return;
    }

    vendorOnboardingApi.getStatus(vendorId)
      .then((status) => {
        const normalizedStatus = String(status.status || '').toUpperCase();
        if (['UNDER_REVIEW', 'PENDING_ACTIVATION', 'ACTIVE'].includes(normalizedStatus)) {
          setApplicationSubmitted(true);
        }
        setIsCheckingSavedDraft(false);
      })
      .catch(() => {
        resetOnboardingState();
        setIsCheckingSavedDraft(false);
      });
  }, []);

  const ensureDraft = async () => {
    if (vendorId) {
      return vendorId;
    }

    const draft = await vendorOnboardingApi.createDraft(getPayload());
    setVendorId(draft.id);
    return draft.id;
  };

  const saveCurrentStep = async () => {
    const existingVendorId = vendorId;
    const id = await ensureDraft();

    if (currentStep === 1 && existingVendorId) {
      await vendorOnboardingApi.updateDraft(id, getPayload());
    }

    if (currentStep === 2 && existingVendorId) {
      await vendorOnboardingApi.updateDraft(id, {
        orgType: formData.orgType,
        specialties: formData.specialties,
      });
    }

    if (currentStep === 4) {
      await vendorOnboardingApi.updateDraft(id, { plan: formData.plan });
    }

    return id;
  };

  const showError = (message: string) => {
    setErrorMessage(message);
  };

  const resetOnboardingState = () => {
    window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    setVendorId(null);
    setCurrentStep(1);
    setFormData({ ...emptyFormData });
    setDocuments({ ...emptyDocuments });
    setApplicationSubmitted(false);
    setErrorMessage('');
  };

  const startPayment = async () => {
    const id = await saveCurrentStep();
    await loadRazorpayCheckout();

    if (!window.Razorpay) {
      throw new Error('Razorpay checkout is unavailable.');
    }

    const order = await vendorOnboardingApi.createRazorpayOrder(id);
    const Razorpay = window.Razorpay;

    await new Promise<void>((resolve, reject) => {
      const checkout = new Razorpay({
        key: order.razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Global MAA',
        description: `${formData.plan} vendor onboarding`,
        order_id: order.orderId,
        prefill: {
          name: formData.contactPerson,
          email: formData.email,
          contact: formData.contactNumber,
        },
        theme: {
          color: '#0A2647',
        },
        handler: async (response) => {
          try {
            await vendorOnboardingApi.verifyRazorpayPayment(id, response);
            await vendorOnboardingApi.submit(id);
            setApplicationSubmitted(true);
            setCurrentStep(5);
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        modal: {
          ondismiss: () => reject(new Error('Payment was cancelled.')),
        },
      });

      checkout.open();
    });
  };

  const nextStep = async () => {
    setErrorMessage('');

    if (currentStep === 1 && !identityComplete) {
      showError('Complete all identity fields before continuing.');
      return;
    }

    if (currentStep === 2 && formData.specialties.length === 0) {
      showError('Select at least one medical specialization before continuing.');
      return;
    }

    if (currentStep === 3 && !documentsComplete) {
      showError('Upload all required documents before continuing.');
      return;
    }

    if (currentStep === 1 && !vendorId) {
      setCurrentStep(2);
      return;
    }

    setIsSaving(true);
    try {
      if (currentStep === 4) {
        await startPayment();
        return;
      }

      await saveCurrentStep();
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    } catch (error) {
      showError(getRequestErrorMessage(error, 'Unable to save onboarding details.'));
    } finally {
      setIsSaving(false);
    }
  };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const toggleSpecialty = (item: string) => {
    const list = formData.specialties;
    const newList = list.includes(item) 
      ? list.filter(i => i !== item) 
      : [...list, item];
    setFormData(prev => ({ ...prev, specialties: newList }));
  };

  const plans = [
    { name: 'Standard' as VendorPlan, price: '1', features: ['Basic Registry Listing', 'Email Support', '5 Tender Bids/Mo'] },
    { name: 'Pro' as VendorPlan, price: '2', features: ['Featured Listing', 'Priority Support', 'Unlimited Tender Bids', 'Analytics Dashboard'] },
    { name: 'Premium' as VendorPlan, price: '3', features: ['Global Homepage Feature', 'Dedicated Account Manager', 'Custom Procurement API', 'VIP Event Access'] }
  ];

  const handleDocumentUpload = async (documentType: VendorDocumentType, file?: File | null) => {
    if (!file) {
      return;
    }

    setErrorMessage('');
    setUploadingDocument(documentType);

    try {
      const id = await ensureDraft();
      const uploadMeta = {
        documentType,
        fileName: file.name,
        contentType: file.type || 'application/octet-stream',
        fileSize: file.size,
      };
      const presign = await vendorOnboardingApi.presignDocument(id, uploadMeta);

      const uploadResponse = await fetch(presign.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': uploadMeta.contentType,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error('Document upload failed. Please try again.');
      }

      await vendorOnboardingApi.completeDocument(id, {
        ...uploadMeta,
        fileKey: presign.fileKey,
      });

      setDocuments(prev => ({
        ...prev,
        [documentType]: {
          fileName: file.name,
          fileKey: presign.fileKey,
        },
      }));
    } catch (error) {
      showError(getRequestErrorMessage(error, 'Unable to upload document.'));
    } finally {
      setUploadingDocument(null);
    }
  };

  const actionDisabled =
    isSaving ||
    Boolean(uploadingDocument) ||
    (currentStep === 1 && !identityComplete) ||
    (currentStep === 3 && !documentsComplete);

  if (isCheckingSavedDraft) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#F3F4F6] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl border border-navy/5 p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-cyan/10 rounded-3xl flex items-center justify-center text-cyan mb-6">
            <Activity size={30} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-cyan mb-3">Checking Status</p>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-navy mb-3">Loading Application</h2>
          <p className="text-xs font-bold uppercase tracking-widest leading-relaxed text-navy/40">
            Confirming your latest vendor onboarding status.
          </p>
        </div>
      </div>
    );
  }

  if (applicationSubmitted) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#F3F4F6] flex items-center justify-center overflow-y-auto p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-navy/5 overflow-hidden"
        >
          <div className="bg-[#0A2647] p-8 sm:p-10 text-white relative">
            <button
              onClick={onCancel}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest"
            >
              Close
            </button>
            <div className="w-16 h-16 bg-emerald-500/15 rounded-3xl flex items-center justify-center text-emerald-300 mb-8">
              <ShieldCheck size={34} />
            </div>
            <p className="text-cyan text-[10px] font-black uppercase tracking-[0.35em] mb-4">Application Received</p>
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none">
              Under<br />Consideration
            </h2>
          </div>

          <div className="p-8 sm:p-10 space-y-8">
            <div>
              <h3 className="text-xl font-black text-navy uppercase tracking-tight mb-3">
                {formData.orgName || 'Your organisation'}
              </h3>
              <p className="text-sm font-bold text-navy/50 leading-relaxed">
                Your vendor application has been submitted successfully. Our compliance team is reviewing your details and documents. We will get back to you soon.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['Details Sent', 'Documents Received', 'Review In Progress'].map((item) => (
                <div key={item} className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <Check size={16} className="text-emerald-500 mb-3" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-navy/50">{item}</p>
                </div>
              ))}
            </div>

            <button
              onClick={onCancel}
              className="w-full bg-navy text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-navy/20"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#F3F4F6] flex items-start lg:items-center justify-center overflow-y-auto p-3 sm:p-6 lg:p-10">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-5xl max-h-none lg:max-h-[calc(100dvh-5rem)] bg-white rounded-[28px] sm:rounded-[40px] shadow-2xl border border-navy/5 relative overflow-hidden lg:overflow-y-auto"
      >
        <div className="grid lg:grid-cols-12 min-h-0 lg:min-h-[700px]">
          {/* Left: Progress Sidebar */}
          <div className="lg:col-span-4 bg-[#0A2647] p-6 sm:p-8 lg:p-12 text-white relative flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-12">
                <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center font-bold text-white uppercase">M</div>
                <span className="text-white font-black tracking-[0.2em] text-xs">GLOBAL MAA</span>
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 leading-tight">Institutional<br/>Registration</h2>
              <p className="text-white/40 text-[9px] font-bold leading-relaxed mb-12 uppercase tracking-widest">Phase 01: Secure Entry Pipeline</p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-8">
                {STEPS.map((step) => (
                  <div key={step.id} className="flex gap-4 group">
                    <div className="hidden lg:flex flex-col items-center">
                      <div className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500",
                        currentStep === step.id ? "bg-cyan shadow-lg shadow-cyan/40 scale-110" : 
                        currentStep > step.id ? "bg-emerald-500" : "bg-white/10"
                      )}>
                        {currentStep > step.id ? <Check size={16} /> : <step.icon size={16} />}
                      </div>
                      {step.id !== STEPS.length && (
                        <div className={cn(
                          "w-0.5 h-10 my-2 transition-colors duration-500",
                          currentStep > step.id ? "bg-emerald-500" : "bg-white/10"
                        )} />
                      )}
                    </div>
                    <div className="pt-1 flex items-start gap-3 lg:block">
                      <div className={cn(
                        "lg:hidden w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500 shrink-0",
                        currentStep === step.id ? "bg-cyan shadow-lg shadow-cyan/40 scale-110" :
                        currentStep > step.id ? "bg-emerald-500" : "bg-white/10"
                      )}>
                        {currentStep > step.id ? <Check size={16} /> : <step.icon size={16} />}
                      </div>
                      <div>
                      <h4 className={cn(
                        "text-[10px] font-black uppercase tracking-widest transition-colors",
                        currentStep === step.id ? "text-white" : "text-white/40"
                      )}>{step.title}</h4>
                      <p className="text-[10px] text-white/20 mt-1">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block pt-12">
               <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                 <p className="text-[10px] font-black uppercase tracking-widest text-cyan mb-2 flex items-center gap-2">
                   <ShieldCheck size={12} fill="currentColor" /> GMAA Verification
                 </p>
                 <p className="text-[10px] text-white/40 leading-relaxed uppercase font-bold">Your security is our priority. All documents are verified by human agents.</p>
               </div>
            </div>
          </div>

          {/* Right: Form Content */}
          <div className="lg:col-span-8 p-6 sm:p-8 lg:p-16 xl:p-20 relative flex flex-col">
            <button 
              onClick={onCancel}
              className="absolute top-5 right-5 lg:top-8 lg:right-8 text-navy/20 hover:text-brand-red transition-colors uppercase text-[10px] font-black tracking-widest z-10"
            >
              Exit
            </button>

            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8 lg:space-y-12"
                >
                  {/* Step Header */}
                  <div>
                    <span className="text-cyan text-[10px] font-black uppercase tracking-[0.4em]">Step 0{currentStep} of 0{STEPS.length}</span>
                    <h3 className="text-4xl font-black text-navy uppercase tracking-tighter mt-4">{STEPS.find(s => s.id === currentStep)?.title}</h3>
                  </div>

                  {/* Step 1: Basic Details */}
                  {currentStep === 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-8">
                       <div className="col-span-2 space-y-2">
                         <label className="text-[10px] font-black uppercase text-navy/40 tracking-widest px-1">Organisation Name</label>
                         <input 
                           type="text" 
                           placeholder="Global Health General Hospital"
                           className="w-full bg-slate-100 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-cyan/50"
                           value={formData.orgName}
                           onChange={(e) => setFormData({...formData, orgName: e.target.value})}
                         />
                       </div>
                       <div className="col-span-2 space-y-2">
                         <label className="text-[10px] font-black uppercase text-navy/40 tracking-widest px-1">Full Organisation Address</label>
                         <div className="relative">
                            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-navy/20" size={18} />
                            <input 
                              type="text" 
                              placeholder="123 Medic St, Health Corridor, Singapore"
                              className="w-full bg-slate-100 border-none rounded-2xl p-5 pl-14 text-sm font-bold focus:ring-2 focus:ring-cyan/50"
                              value={formData.address}
                              onChange={(e) => setFormData({...formData, address: e.target.value})}
                            />
                         </div>
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-navy/40 tracking-widest px-1">Organisation Email</label>
                         <input 
                           type="email" 
                           placeholder="contact@organisation.com"
                           className="w-full bg-slate-100 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-cyan/50"
                           value={formData.email}
                           onChange={(e) => setFormData({...formData, email: e.target.value})}
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-navy/40 tracking-widest px-1">Contact Number</label>
                         <div className="rounded-2xl bg-slate-100">
                           <IndianPhoneInput
                           value={formData.contactNumber}
                           onChange={(value) => setFormData({...formData, contactNumber: value})}
                           placeholder="10 digit number"
                           prefixClassName="pl-5 pr-3 py-5 text-[10px]"
                           inputClassName="min-w-0 flex-1 bg-transparent border-none rounded-r-2xl py-5 pl-3 pr-5 text-sm font-bold focus:ring-2 focus:ring-cyan/50"
                         />
                         </div>
                         {formData.contactNumber && !contactNumberIsValid && (
                           <p className="px-1 text-[9px] font-black uppercase tracking-widest text-brand-red">
                             Enter exactly 10 digits.
                           </p>
                         )}
                       </div>
                       <div className="col-span-2 space-y-2">
                         <label className="text-[10px] font-black uppercase text-navy/40 tracking-widest px-1">Concerned Person Name</label>
                         <div className="relative">
                            <UserCircle2 className="absolute left-5 top-1/2 -translate-y-1/2 text-navy/20" size={18} />
                            <input 
                              type="text" 
                              placeholder="Dr. John Doe"
                              className="w-full bg-slate-100 border-none rounded-2xl p-5 pl-14 text-sm font-bold focus:ring-2 focus:ring-cyan/50"
                              value={formData.contactPerson}
                              onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                            />
                         </div>
                       </div>
                    </div>
                  )}

                  {/* Step 2: Expertise */}
                  {currentStep === 2 && (
                    <div className="space-y-10">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-navy/40 tracking-widest px-1">Organisation Type</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
                          {['Hospital', 'Diagnostic Center', 'Specialty Clinic'].map((type) => (
                            <button
                              key={type}
                              onClick={() => setFormData({...formData, orgType: type as VendorOrgType})}
                              type="button"
                              className={cn(
                                "py-4 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all",
                                formData.orgType === type ? "border-cyan bg-cyan/5 text-cyan" : "border-slate-100 text-navy/20 hover:border-navy/10"
                              )}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-navy/40 tracking-widest px-1">Medical Specializations</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            'Cardiothoracic', 'Oncology Care', 'Advanced Ortho', 
                            'Neurological', 'Dental Cosmetic', 'IVF & Reproductive',
                            'Bariatric Surgery', 'Ophthalmology'
                          ].map((item) => (
                            <button
                              key={item}
                              onClick={() => toggleSpecialty(item)}
                              type="button"
                              className={cn(
                                "p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between",
                                formData.specialties.includes(item) 
                                  ? "border-navy bg-navy text-white shadow-xl shadow-navy/20" 
                                  : "border-slate-50 bg-slate-50/50 hover:border-navy/10"
                              )}
                            >
                              <span className="text-[9px] font-black uppercase tracking-widest">{item}</span>
                              <div className={cn(
                                "w-4 h-4 rounded border flex items-center justify-center transition-all",
                                formData.specialties.includes(item) ? "bg-white/20 border-white/40" : "border-slate-300"
                              )}>
                                {formData.specialties.includes(item) && <Check size={10} />}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Documents */}
                  {currentStep === 3 && (
                    <div className="space-y-8">
                       <p className="text-[10px] font-bold text-navy/40 uppercase tracking-widest leading-relaxed">Please submit relevant registration documents for authenticity verification.</p>
                       
                       <div className="grid grid-cols-1 gap-6">
                          {DOCUMENTS.map((doc) => {
                            const selectedDocument = documents[doc.type];
                            const isUploading = uploadingDocument === doc.type;

                            return (
                            <div key={doc.type} className="p-5 lg:p-8 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-slate-50/50 group hover:border-cyan/30 transition-all">
                               <div className="flex items-center gap-6">
                                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-navy shadow-lg group-hover:bg-cyan group-hover:text-white transition-all">
                                   <doc.icon size={20} />
                                 </div>
                                 <div>
                                   <h4 className="text-[10px] font-black uppercase text-navy tracking-widest">{doc.label}</h4>
                                   <p className={cn(
                                     "text-[8px] font-bold uppercase mt-1",
                                     selectedDocument ? "text-emerald-600" : "text-navy/40"
                                   )}>
                                     {selectedDocument ? selectedDocument.fileName : 'Pending Selection'}
                                   </p>
                                 </div>
                               </div>
                               <label className={cn(
                                 "px-6 py-2 bg-navy text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-brand-red transition-all cursor-pointer text-center",
                                 isUploading && "opacity-60 pointer-events-none"
                               )}>
                                 <input
                                   type="file"
                                   className="hidden"
                                   accept=".pdf,.png,.jpg,.jpeg,.webp"
                                   disabled={Boolean(uploadingDocument) || isSaving}
                                   onChange={(event) => {
                                     const file = event.target.files?.[0];
                                     void handleDocumentUpload(doc.type, file);
                                     event.currentTarget.value = '';
                                   }}
                                 />
                                 <CloudUpload size={12} className="mr-2 inline-block" />
                                 {isUploading ? 'Uploading' : selectedDocument ? 'Replace' : 'Upload'}
                               </label>
                            </div>
                          )})}
                       </div>
                    </div>
                  )}

                  {/* Step 4: Payment */}
                  {currentStep === 4 && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                        {plans.map((p) => (
                          <button
                            key={p.name}
                            onClick={() => setFormData({...formData, plan: p.name})}
                            type="button"
                            className={cn(
                              "relative p-8 rounded-[32px] border-2 text-left transition-all h-full flex flex-col",
                              formData.plan === p.name 
                                ? "border-brand-red bg-white shadow-2xl scale-[1.02]" 
                                : "border-slate-100 bg-slate-50/50 grayscale opacity-60 hover:grayscale-0 hover:opacity-100"
                            )}
                          >
                             {formData.plan === p.name && (
                               <div className="absolute top-4 right-4 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white">
                                 <Check size={14} />
                               </div>
                             )}
                             <h4 className="text-[10px] font-black uppercase tracking-widest text-navy/40 mb-2">{p.name} PLAN</h4>
                             <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-3xl font-black text-navy">Rs {p.price}</span>
                                <span className="text-[8px] font-bold text-navy/40 uppercase">INR / One-time</span>
                             </div>
                             
                             <div className="space-y-4 flex-1">
                               {p.features.map((f, i) => (
                                 <div key={i} className="flex gap-2 items-start">
                                   <Check size={10} className="text-emerald-500 mt-1 shrink-0" />
                                   <span className="text-[9px] font-bold text-navy/60 uppercase leading-tight">{f}</span>
                                 </div>
                               ))}
                             </div>
                          </button>
                        ))}
                      </div>
                      
                      <div className="bg-navy rounded-3xl p-6 lg:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Secured Checkout via Razorpay</p>
                            <h4 className="text-lg font-black uppercase tracking-tighter">GMAA Institutional Enrollment</h4>
                         </div>
                         <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Total Due</p>
                            <p className="text-2xl font-black">Rs {plans.find(p => p.name === formData.plan)?.price} INR</p>
                         </div>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Verification Status */}
                  {currentStep === 5 && (
                    <div className="flex flex-col items-center justify-center text-center py-12">
                       <div className="w-24 h-24 bg-brand-red/10 rounded-[40px] flex items-center justify-center text-brand-red mb-8 relative">
                          <ShieldCheck size={48} />
                          <motion.div 
                            animate={{ scale: [1, 1.2, 1] }} 
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-brand-red rounded-full border-4 border-white flex items-center justify-center text-white"
                          >
                             <Activity size={16} />
                          </motion.div>
                       </div>
                       
                       <h3 className="text-4xl font-bold text-navy uppercase tracking-tighter mb-4">Analysis<br/>Commenced</h3>
                       <p className="text-xs font-bold text-navy/40 uppercase tracking-widest max-w-md leading-relaxed mb-12">
                         Your organisation is now in the <span className="text-brand-red">Active Verification Pipeline</span>. Our compliance team is auditing your digital dossiers.
                       </p>

                       <button 
                         onClick={() => setCurrentStep(prev => prev + 1)}
                         className="flex items-center gap-4 group text-navy/40 hover:text-navy transition-all"
                       >
                         <span className="text-[10px] font-black uppercase tracking-widest">Preview Network Status</span>
                         <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                       </button>
                    </div>
                  )}

                  {/* Step 6: Registry Preview */}
                  {currentStep === 6 && (
                    <div className="flex flex-col items-center justify-center text-center py-12">
                       <div className="w-24 h-24 bg-cyan/10 rounded-[40px] flex items-center justify-center text-cyan mb-8">
                          <Globe size={48} />
                       </div>
                       
                       <h3 className="text-4xl font-bold text-navy uppercase tracking-tighter mb-4">Global Node<br/>Pending</h3>
                       <p className="text-xs font-bold text-navy/40 uppercase tracking-widest max-w-md leading-relaxed mb-12">
                         Upon approval, your node will be activated in the <span className="text-cyan">Global Med Access Registry</span>, visible to patients across 140+ countries.
                       </p>

                       <div className="bg-navy p-10 rounded-[40px] w-full max-w-md text-left relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                          <div className="flex items-center gap-4 mb-8">
                             <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white font-black">{formData.orgName?.charAt(0) || 'G'}</div>
                             <div>
                                <h4 className="text-white font-black uppercase tracking-tight text-sm">{formData.orgName || 'Your Organisation'}</h4>
                                <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Pending Activation</p>
                             </div>
                          </div>
                          <div className="space-y-3">
                             <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: '95%' }} className="h-full bg-cyan shadow-[0_0_15px_rgba(0,255,255,0.5)]" />
                             </div>
                             <p className="text-[8px] font-black uppercase text-cyan tracking-[0.2em]">Institutional Sync: 95%</p>
                          </div>
                       </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Actions */}
            {errorMessage && (
              <div className="mt-8 rounded-2xl bg-brand-red/10 px-5 py-4 text-[10px] font-black uppercase tracking-widest text-brand-red">
                {errorMessage}
              </div>
            )}
            <div className="mt-8 lg:mt-16 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 lg:pt-12 border-t border-slate-100">
               {currentStep < 5 ? (
                 <>
                   <button 
                     onClick={prevStep}
                     disabled={currentStep === 1}
                     className={cn(
                       "flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all",
                       currentStep === 1 ? "opacity-0 pointer-events-none" : "text-navy hover:text-cyan"
                     )}
                   >
                     <ChevronLeft size={18} /> Previous
                   </button>

                   <button 
                     onClick={nextStep}
                     disabled={actionDisabled}
                     className="bg-navy text-white px-8 lg:px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] lg:tracking-[0.3em] text-xs hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-navy/20 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                   >
                     {isSaving ? 'Processing' : currentStep === 4 ? 'Commit & Pay' : 'Next Step'} <ChevronRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                   </button>
                 </>
               ) : (
                 <button 
                   onClick={onComplete}
                   className="w-full bg-navy text-white py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-xs hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-navy/20"
                 >
                   Establish Connection
                 </button>
               )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Plus({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function CheckCircle({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
