import React, { useState, useEffect } from 'react';
import { PaymentMethod, PaymentInitResponse, PaymentChargeResponse, PaymentField, NextAction } from '@/types/payments';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DynamicPaymentFields } from './DynamicPaymentFields';
import { apiClient } from '@/api/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PAYMENT_CHARGE_URL, PAYMENT_INIT_URL } from '@/compos/api/payments';

interface PaymentFlowProps {
  initData: PaymentInitResponse;
  onSuccess?: () => void;
}

export const PaymentFlow: React.FC<PaymentFlowProps> = ({ initData, onSuccess }) => {
  const [methods, setMethods] = useState<PaymentMethod[]>(initData.availableMethods || []);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(methods[0] || null);
  const [currentResponse, setCurrentResponse] = useState<PaymentChargeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const withDefaultFields = (actionUrl: string, form: Record<string, any>): Record<string, any> => {
    let updatedForm: Record<string, any> = { ...form, reference: currentResponse?.reference };
    if (selectedMethod) {
      updatedForm.method = selectedMethod.type;
    }
    
    if(actionUrl === PAYMENT_INIT_URL) {
      updatedForm = { ...updatedForm, ...initData };

    } else if(actionUrl.startsWith(PAYMENT_CHARGE_URL)) {
      console.log(initData, form, currentResponse?.reference);
      updatedForm = { 
        amount: initData.amount,
        currency: initData.currency,
        method: selectedMethod?.type,
        processorId: currentResponse?.paymentProcessorId || selectedMethod?.paymentProcessorId || initData.paymentProcessorId, 
        details: form, 
        reference: currentResponse?.reference 
      };

    } else {
      updatedForm.originalRequestUrl = PAYMENT_INIT_URL;
    }

    // Ensure 'level' is set to 1 if present in fields and not already set
    const currentNextAction = currentResponse?.nextAction || selectedMethod?.nextAction || initData.nextAction;
    const activeFields = currentNextAction?.fields || currentResponse?.fields || selectedMethod?.fields || [];
    if (activeFields.some(f => f.name === 'level') && updatedForm.level === undefined) {
      updatedForm.level = 1;
    }

    console.log("Submitting form data:", updatedForm);
    return updatedForm;
  }

  const getActiveFields = (method: PaymentMethod | null, response: PaymentChargeResponse | null): PaymentField[] => {
    const nextAction = response?.nextAction || method?.nextAction || initData.nextAction;
    if (nextAction) {
      return nextAction.fields || [];
    }
    return response?.fields || method?.fields || [];
  };

  const getActionUrl = (method: PaymentMethod | null, response: PaymentChargeResponse | null): string => {
    const nextAction = response?.nextAction || method?.nextAction || initData.nextAction;
    if (nextAction?.actionUrl) {
      return nextAction.actionUrl;
    }
    return response?.actionUrl || method?.actionUrl || "";
  };

  const getActionButtonLabel = (method: PaymentMethod | null, response: PaymentChargeResponse | null): string | null => {
    const nextAction = response?.nextAction || method?.nextAction || initData.nextAction;
    if (nextAction?.actionUrlButtonLabel) {
      return nextAction.actionUrlButtonLabel;
    }
    return response?.actionUrlButtonLabel || method?.actionUrlButtonLabel || null;
  };

  const getMessage = (method: PaymentMethod | null, response: PaymentChargeResponse | null): string | undefined => {
    return response?.nextAction?.message || method?.nextAction?.message || initData.nextAction?.message;
  };

  useEffect(() => {
    if (!selectedMethod) return;
    console.log("Selected method changed:", selectedMethod);
    const activeFields = getActiveFields(selectedMethod, null);
    const actionUrl = getActionUrl(selectedMethod, null);

    if (activeFields.length === 0 && actionUrl) {
      handleCharge(actionUrl, withDefaultFields(actionUrl, {}));
    } else {
      setCurrentResponse(null);
      setFormData({});
    }
  }, [selectedMethod]);

  useEffect(() => {
    console.log("currentResponse:", currentResponse);

    if (currentResponse?.availableMethods && currentResponse.availableMethods.length > 0) {
      setMethods(currentResponse.availableMethods);
      setSelectedMethod(currentResponse.availableMethods[0]);
      return;
    }

    const nextAction = currentResponse?.nextAction;
    if (nextAction?.redirectUrl) {
        window.location.href = nextAction.redirectUrl;
        return;
    }

    const activeFields = getActiveFields(selectedMethod, currentResponse);
    const actionUrl = getActionUrl(selectedMethod, currentResponse);
    const actionButtonLabel = getActionButtonLabel(selectedMethod, currentResponse);

    console.log("Active fields for current response:", activeFields);
    console.log("Action URL for current response:", actionUrl);

    if (currentResponse && activeFields.length === 0 && actionUrl && !actionButtonLabel) {
      handleCharge(actionUrl, withDefaultFields(actionUrl, formData));
    }
  }, [currentResponse]);

  useEffect(() => {
    // Handle initial state with no methods but a nextAction
    if (methods.length === 0 && !currentResponse && initData.nextAction) {
      const activeFields = getActiveFields(null, null);
      const actionUrl = getActionUrl(null, null);
      const actionButtonLabel = getActionButtonLabel(null, null);
      if (activeFields.length === 0 && actionUrl && !actionButtonLabel) {
        handleCharge(actionUrl, withDefaultFields(actionUrl, {}));
      }
    }
  }, [methods, currentResponse]);

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
        // Not completed, update state with new fields/actionUrl/nextAction
        setCurrentResponse(response);
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
    const actionUrl = getActionUrl(selectedMethod, currentResponse);
    handleCharge(actionUrl, withDefaultFields(actionUrl, formData));
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

  const activeFields = getActiveFields(selectedMethod, currentResponse);
  const actionButtonLabel = getActionButtonLabel(selectedMethod, currentResponse);
  const message = getMessage(selectedMethod, currentResponse);

  const renderForm = (methodName?: string) => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {methodName && <h3 className="text-xl font-semibold">{methodName}</h3>}
        {isLoading && !currentResponse ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {message && (
              <Alert className="mb-6 bg-primary/5 border-primary/20">
                <AlertCircle className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary font-bold">Action Required</AlertTitle>
                <AlertDescription className="text-sm">
                  {message}
                </AlertDescription>
              </Alert>
            )}
            <DynamicPaymentFields
              fields={activeFields}
              onChange={(name, value) => setFormData(prev => ({ ...prev, [name]: value }))}
              values={formData}
            />
          </>
        )}
      </div>

      { !isLoading && (activeFields.length > 0 || actionButtonLabel) && (
        <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {actionButtonLabel || "Continue"}
        </Button>
      )}

      {currentResponse && activeFields.length === 0 && !isLoading && (
        <div className="text-center py-4 text-muted-foreground">
          Processing...
        </div>
      )}
    </form>
  );

  return (
    <div className="w-full">
      {methods.length > 0 ? (
        <Tabs
          value={selectedMethod?.type || undefined}
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
                    {renderForm(method.name)}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      ) : (
        <Card className="border-none shadow-none bg-transparent">
          <CardContent className="p-0">
            {renderForm()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
