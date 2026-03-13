import React, { useState } from 'react';
import { sitesApi } from '@/api/sites';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteId: string;
}

const PLANS = [
    { id: 'free', name: 'Free', price: '$0', features: ['FrontBacked Subdomain', 'Standard Themes'] },
    { id: 'monthly', name: 'Monthly', price: '$12/mo', features: ['Custom Domain', 'Premium Themes', 'Priority Support'] },
    { id: 'yearly', name: 'Yearly', price: '$99/yr', features: ['Custom Domain', 'Premium Themes', '2 Months Free'] },
];

export const SubscriptionModal = ({ open, onOpenChange, siteId }: SubscriptionModalProps) => {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('free');

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await sitesApi.updateSubscription(siteId, { plan: selectedPlan });
      toast.success("Subscription updated!");
      onOpenChange(false);
    } catch (error: any) {
      toast.error("Failed to update plan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Site Plan</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
            {PLANS.map(plan => (
                <div
                    key={plan.id}
                    className={cn(
                        "p-4 border-2 rounded-xl cursor-pointer transition-all flex justify-between items-center",
                        selectedPlan === plan.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/20"
                    )}
                    onClick={() => setSelectedPlan(plan.id)}
                >
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="font-bold">{plan.name}</span>
                            {selectedPlan === plan.id && <Check className="h-4 w-4 text-primary" />}
                        </div>
                        <p className="text-xs text-muted-foreground">{plan.features.join(' • ')}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold">{plan.price}</p>
                    </div>
                </div>
            ))}
        </div>

        <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <CreditCard className="mr-2 h-4 w-4" />
                Update Plan
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
