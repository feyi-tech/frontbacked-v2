import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { paymentsApi } from '@/api/payments';
import { KYCStatusValue } from '@/types/payments';
import { KYCFormStepper } from '@/components/payments/KYCFormStepper';
import { ShieldCheck, Info, Loader2, Sparkles, UserCheck, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Meta from '@/components/Meta';

const KYCPage = () => {
  const [status, setStatus] = useState<KYCStatusValue>('none');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKYC = async () => {
      setLoading(true);
      try {
        const res = await paymentsApi.getKYCStatus();
        setStatus(res.status);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load KYC status",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchKYC();
  }, []);

  const handleSubmit = async (data: FormData) => {
    try {
      await paymentsApi.submitKYC(data);
      setStatus('pending');
      toast({
        title: "KYC Submitted",
        description: "Your document has been successfully submitted for review.",
      });
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message || "Failed to submit KYC data",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <Meta title="Identity Verification" description="Help us keep your account secure and comply with regulations." />
      <div className="max-w-6xl mx-auto space-y-12 pb-20 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight">Identity Verification</h1>
            <p className="text-muted-foreground text-lg">Help us keep your account secure and comply with regulations.</p>
          </div>
          <div className="flex items-center gap-3 bg-primary/5 p-3 rounded-2xl border border-primary/10">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Secure Multi-factor Identity Verification</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-muted-foreground font-medium animate-pulse">Checking verification status...</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8">
              <KYCFormStepper status={status} onSubmit={handleSubmit} />
            </div>

            <div className="lg:col-span-4 space-y-8">
              <div className="p-8 rounded-[2rem] bg-gradient-to-br from-primary to-primary/80 text-primary-foreground space-y-6 shadow-2xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
                <h3 className="font-bold text-xl flex items-center gap-2">
                  <UserCheck className="w-6 h-6 text-white" />
                  Why verify?
                </h3>
                <ul className="space-y-4">
                  {[
                    "Higher transaction limits",
                    "Faster withdrawals",
                    "Access to premium themes",
                    "Priority support access"
                  ].map((text, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-primary-foreground/90 font-medium">
                      <div className="w-2 h-2 rounded-full bg-white/40" />
                      {text}
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                  <span className="text-xs font-black uppercase tracking-widest text-white/80">Get Verified Status</span>
                </div>
              </div>

              <div className="p-6 bg-muted rounded-2xl border border-muted-foreground/10 flex items-start gap-4">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Info className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">Need help?</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Check out our <a href="#" className="text-primary underline font-medium">Verification Guide</a> or contact support if you're having trouble uploading.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-red-500/5 rounded-2xl border border-red-500/10 flex items-start gap-4">
                <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">Important Note</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    Ensure your documents are clear and valid. Expired or blurred documents will be rejected automatically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default KYCPage;
