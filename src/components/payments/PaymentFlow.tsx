import React, { useState, useEffect } from 'react';
import { PaymentMethod, PaymentInitResponse, PaymentChargeResponse, PaymentField } from '@/types/payments';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DynamicPaymentFields } from './DynamicPaymentFields';
import { apiClient } from '@/api/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';

interface PaymentFlowProps {
  initData: PaymentInitResponse;
  onSuccess?: () => void;
}

export const PaymentFlow: React.FC<PaymentFlowProps> = ({ initData, onSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(initData.availableMethods[0]);
  const [currentResponse, setCurrentResponse] = useState<PaymentChargeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const methods = initData.availableMethods;

  useEffect(() => {
    // If fields are empty for a method, trigger actionUrl immediately upon selection
    if (selectedMethod && (!selectedMethod.fields || selectedMethod.fields.length === 0)) {
      handleCharge(selectedMethod.actionUrl, {});
    } else {
        setCurrentResponse(null);
        setFormData({});
    }
  }, [selectedMethod]);

  const handleCharge = async (url: string, data: any) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<PaymentChargeResponse>(url, data);

      if (response.completed) {
        if (response.status === 'ok') {
          setPaymentStatus('success');
          Swal.fire({
            title: 'Success!',
            text: 'Payment successful!',
            icon: 'success',
            confirmButtonColor: 'hsl(var(--primary))',
          });
          if (onSuccess) onSuccess();
        } else {
          setPaymentStatus('failed');
          setErrorMessage(response.error || "Payment failed");
          Swal.fire({
            title: 'Payment Failed',
            text: response.error || 'Payment failed',
            icon: 'error',
            confirmButtonColor: 'hsl(var(--primary))',
          });
        }
      } else {
        // Not completed, update state with new fields/actionUrl
        setCurrentResponse(response);
        // If the new response has empty fields, we might need to handle it
        if (response.fields && response.fields.length === 0 && response.actionUrl) {
            handleCharge(response.actionUrl, {});
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const actionUrl = currentResponse?.actionUrl || selectedMethod.actionUrl;
    handleCharge(actionUrl, formData);
  };

  if (paymentStatus === 'success') {
    return (
      <Card className="max-w-md mx-auto text-center p-8">
        <CardContent className="space-y-4">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold">Payment Successful</h2>
          <p className="text-muted-foreground">Your transaction has been processed successfully.</p>
          <Button onClick={() => window.location.reload()} className="w-full">Done</Button>
        </CardContent>
      </Card>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <Card className="max-w-md mx-auto text-center p-8">
        <CardContent className="space-y-4">
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold">Payment Failed</h2>
          <p className="text-muted-foreground">{errorMessage}</p>
          <Button onClick={() => setPaymentStatus('idle')} className="w-full">Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  const activeFields = currentResponse?.fields || selectedMethod?.fields || [];
  const actionButtonLabel = currentResponse?.actionUrlButtonLabel || selectedMethod?.actionUrlButtonLabel || "Pay Now";

  return (
    <div className="w-full">
      <Tabs
        defaultValue={methods[0].type}
        onValueChange={(val) => {
          const method = methods.find(m => m.type === val);
          if (method) setSelectedMethod(method);
        }}
        className="flex flex-col md:flex-row gap-6"
      >
        <TabsList className="flex flex-row md:flex-col h-auto bg-transparent border-b md:border-b-0 md:border-r border-border p-0 items-stretch shrink-0">
          {methods.map((method) => (
            <TabsTrigger
              key={method.type}
              value={method.type}
              className="px-4 py-3 md:px-6 md:py-4 justify-start rounded-none border-b-2 md:border-b-0 md:border-r-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary transition-all text-left"
            >
              {method.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1">
          {methods.map((method) => (
            <TabsContent key={method.type} value={method.type} className="m-0 focus-visible:outline-none focus-visible:ring-0">
              <Card className="border-none shadow-none bg-transparent">
                <CardContent className="p-0">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">{method.name}</h3>
                      {isLoading && !currentResponse ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                      ) : (
                        <DynamicPaymentFields
                          fields={activeFields}
                          onChange={(name, value) => setFormData(prev => ({ ...prev, [name]: value }))}
                          values={formData}
                        />
                      )}
                    </div>

                    {activeFields.length > 0 && (
                      <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        {actionButtonLabel}
                      </Button>
                    )}

                    {currentResponse && activeFields.length === 0 && !isLoading && (
                        <div className="text-center py-4 text-muted-foreground">
                            Processing...
                        </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};
