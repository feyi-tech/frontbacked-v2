import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, User, FileText, Upload, ArrowRight, ArrowLeft, Send } from 'lucide-react';
import { cn } from "@/lib/utils";
import { KYCStatusValue } from "@/types/payments";

interface KYCFormStepperProps {
  onSubmit: (data: FormData) => void;
  status: KYCStatusValue;
  initialData?: any;
}

export const KYCFormStepper: React.FC<KYCFormStepperProps> = ({
  onSubmit,
  status,
  initialData
}) => {
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    fullName: initialData?.fullName || '',
    idType: initialData?.idType || 'national_id',
    idNumber: initialData?.idNumber || '',
    documentFile: null as File | null,
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('fullName', formData.fullName);
    data.append('idType', formData.idType);
    data.append('idNumber', formData.idNumber);
    if (formData.documentFile) {
      data.append('document', formData.documentFile);
    }
    onSubmit(data);
  };

  if (status === 'verified') {
    return (
      <Card className="border-green-500/20 bg-green-500/5 shadow-xl overflow-hidden">
        <div className="h-2 bg-green-500" />
        <CardContent className="p-12 text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border-4 border-green-500/20 animate-pulse">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight">Identity Verified</h2>
            <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Your account has been fully verified. You now have unrestricted access to all features and higher transaction limits.
            </p>
          </div>
          <Button variant="outline" className="px-8 rounded-full border-green-500/30 hover:bg-green-500/10 hover:text-green-600 transition-colors">
            View Certificate
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (status === 'pending') {
    return (
      <Card className="border-yellow-500/20 bg-yellow-500/5 shadow-xl overflow-hidden">
        <div className="h-2 bg-yellow-500" />
        <CardContent className="p-12 text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center border-4 border-yellow-500/20">
            <FileText className="w-10 h-10 text-yellow-600 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight">Review in Progress</h2>
            <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
              We're currently reviewing your documents. This usually takes 24-48 business hours. We'll notify you once it's done.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 bg-white/50 backdrop-blur-sm p-3 rounded-2xl border border-yellow-500/10 w-fit mx-auto">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping" />
            <span className="text-sm font-medium text-yellow-700">Currently under manual review</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-2xl overflow-hidden bg-background">
      <div className="h-1.5 bg-muted flex">
        <div className={cn("h-full bg-primary transition-all duration-500", step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full')} />
      </div>
      <CardHeader className="p-8 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <User className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary/70">Step {step} of 3</span>
        </div>
        <CardTitle className="text-3xl font-extrabold tracking-tight">Identity Verification</CardTitle>
        <CardDescription className="text-base">Complete these steps to unlock full account features.</CardDescription>
      </CardHeader>

      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-2.5">
                <Label htmlFor="fullName" className="text-sm font-semibold pl-1">Full Legal Name</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name as on ID"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="h-12 px-4 rounded-xl border-2 focus-visible:ring-primary/20"
                  required
                />
              </div>
              <Button type="button" className="w-full h-12 rounded-xl text-base font-bold shadow-lg" onClick={nextStep} disabled={!formData.fullName}>
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-2.5">
                <Label className="text-sm font-semibold pl-1">Document Type</Label>
                <Select
                  value={formData.idType}
                  onValueChange={(val) => setFormData({...formData, idType: val})}
                >
                  <SelectTrigger className="h-12 px-4 rounded-xl border-2">
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="national_id" className="py-3">National ID Card</SelectItem>
                    <SelectItem value="passport" className="py-3">Passport</SelectItem>
                    <SelectItem value="drivers_license" className="py-3">Driver's License</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="idNumber" className="text-sm font-semibold pl-1">Document Number</Label>
                <Input
                  id="idNumber"
                  placeholder="e.g. 12345-67890"
                  value={formData.idNumber}
                  onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                  className="h-12 px-4 rounded-xl border-2"
                  required
                />
              </div>
              <div className="flex gap-4">
                <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl font-bold" onClick={prevStep}>
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
                <Button type="button" className="flex-[2] h-12 rounded-xl font-bold shadow-lg" onClick={nextStep} disabled={!formData.idNumber}>
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-2.5">
                <Label className="text-sm font-semibold pl-1">Upload Document Photo</Label>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer hover:border-primary/50 hover:bg-primary/5",
                    formData.documentFile ? "border-primary bg-primary/5" : "border-muted-foreground/20"
                  )}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => setFormData({...formData, documentFile: e.target.files?.[0] || null})}
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className={cn("p-4 rounded-2xl", formData.documentFile ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                      <Upload className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-lg">{formData.documentFile ? formData.documentFile.name : 'Choose a file'}</p>
                      <p className="text-sm text-muted-foreground">PDF, JPG, or PNG (Max. 5MB)</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl font-bold" onClick={prevStep}>
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
                <Button type="submit" className="flex-[2] h-12 rounded-xl font-bold shadow-lg" disabled={!formData.documentFile}>
                  Submit for Verification
                  <Send className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
