import React, { useState, useEffect } from 'react';
import { sitesApi } from '@/api/sites';
import { themesApi } from '@/api/themes';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Check, CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Theme, Site } from '@/types/api';

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteId: string;
  themeId?: string;
}

export const SubscriptionModal = ({ open, onOpenChange, siteId, themeId }: SubscriptionModalProps) => {
  const [loading, setLoading] = useState(false);
  const [fetchingTheme, setFetchingTheme] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [theme, setTheme] = useState<Theme | null>(null);
  const [site, setSite] = useState<Site | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!open) return;
      setFetchingTheme(true);
      try {
        let currentThemeId = themeId;
        if (!currentThemeId) {
          const siteData = await sitesApi.get(siteId);
          setSite(siteData);
          currentThemeId = siteData.themeId;
          setSelectedPlan(siteData.themePlan);
        } else {
            // If themeId is provided, we still might want site data for current plan
            try {
                const siteData = await sitesApi.get(siteId);
                setSite(siteData);
                setSelectedPlan(siteData.themePlan);
            } catch (e) {
                console.error("Failed to fetch site data", e);
            }
        }

        if (currentThemeId) {
          const themeData = await themesApi.get(currentThemeId);
          setTheme(themeData);
        }
      } catch (error: any) {
        toast.error("Failed to load theme details");
      } finally {
        setFetchingTheme(false);
      }
    };

    fetchData();
  }, [open, siteId, themeId]);

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

  const pricing = theme?.pricing || { monthly: 0, quarterly: 0, yearly: 0, purchase: 0 };

  const plans = [
    { id: 'free', name: 'Free', price: '$0', features: ['FrontBacked Subdomain', 'Standard Themes'] },
    { id: 'monthly', name: 'Monthly', price: `$${pricing.monthly}/mo`, features: ['Custom Domain', 'Premium Themes', 'Priority Support'] },
    { id: 'quarterly', name: 'Quarterly', price: `$${pricing.quarterly}/3mo`, features: ['Custom Domain', 'Premium Themes', 'Priority Support'] },
    { id: 'yearly', name: 'Yearly', price: `$${pricing.yearly}/yr`, features: ['Custom Domain', 'Premium Themes', '2 Months Free'] },
    { id: 'purchased', name: 'Lifetime', price: `$${pricing.purchase}`, features: ['One-time payment', 'Unlimited Updates', 'Custom Domain'] },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Site Plan</DialogTitle>
          {site?.themePlan === 'free' && (
              <DialogDescription>
                  Select a subscription plan to remove the fake site warning.
              </DialogDescription>
          )}
        </DialogHeader>

        {fetchingTheme ? (
            <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
            <div className="py-4 space-y-4">
                {plans.map(plan => (
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
                                {site?.themePlan === plan.id && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded uppercase">Current</span>}
                            </div>
                            <p className="text-xs text-muted-foreground">{plan.features.join(' • ')}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold">{plan.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        )}

        <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={loading || fetchingTheme}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <CreditCard className="mr-2 h-4 w-4" />
                Update Plan
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
