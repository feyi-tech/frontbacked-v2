import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PaymentMethod } from "@/types/payments";
import { Copy, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface PaymentInstructionPanelProps {
  method: PaymentMethod;
  paymentId: string;
  expiresAt?: string; // ISO format
}

export const PaymentInstructionPanel: React.FC<PaymentInstructionPanelProps> = ({
  method,
  paymentId,
  expiresAt
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Transaction reference copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-primary/20 shadow-lg overflow-hidden">
      <div className="h-2 bg-primary" />
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
            {method.name}
          </Badge>
          {expiresAt && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5" />
              <span>Expires: {new Date(expiresAt).toLocaleTimeString()}</span>
            </div>
          )}
        </div>
        <CardTitle className="text-2xl mt-4">How to pay</CardTitle>
        <CardDescription>
          Follow the instructions below to complete your payment securely.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-5 bg-muted rounded-2xl border border-muted-foreground/10">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm shrink-0">
              1
            </div>
            <div className="flex-1 space-y-3">
              <p className="font-medium text-foreground leading-relaxed whitespace-pre-wrap">
                {method.instructions}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Transaction Reference
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <AlertCircle className="w-4 h-4" />
            </div>
            <input
              readOnly
              value={paymentId}
              className="w-full bg-muted/30 border-2 border-dashed border-muted-foreground/20 rounded-xl py-3.5 pl-11 pr-12 font-mono text-sm focus:border-primary/50 focus:ring-0 transition-all outline-none"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1.5 h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all"
              onClick={() => handleCopy(paymentId)}
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground px-1 leading-normal italic">
            * Use this reference as your payment note to ensure your payment is automatically credited.
          </p>
        </div>

        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-primary">Secure Transaction</h4>
            <p className="text-xs text-muted-foreground">Your transaction is encrypted and secured by {method.type === 'stripe' ? 'Stripe' : 'Flutterwave'}.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
