import React, { useState, useEffect } from 'react';
import { sitesApi } from '@/api/sites';
import { themesApi } from '@/api/themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Theme } from '@/types/api';
import { toast } from 'sonner';
import { Check, ChevronRight, Globe, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateSiteWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const CreateSiteWizard = ({ open, onOpenChange, onSuccess }: CreateSiteWizardProps) => {
  const [step, setStep] = useState(1);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [siteName, setSiteName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      themesApi.list().then(setThemes).catch(() => {
      });
    }
  }, [open]);

  const handleCreate = async () => {
    if (!selectedTheme) return;
    setLoading(true);
    try {
      await sitesApi.create({
        name: siteName,
        subdomain,
        themeId: selectedTheme.id,
      });
      toast.success("Site launched successfully!");
      onSuccess();
      onOpenChange(false);
      reset();
    } catch (error: any) {
      toast.error("Launch failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setSelectedTheme(null);
    setSiteName('');
    setSubdomain('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
            <span className={cn(step >= 1 && "text-primary font-medium")}>Choose Theme</span>
            <ChevronRight className="h-3 w-3" />
            <span className={cn(step >= 2 && "text-primary font-medium")}>Site Details</span>
            <ChevronRight className="h-3 w-3" />
            <span className={cn(step >= 3 && "text-primary font-medium")}>Launch</span>
          </div>
          <DialogTitle>
            {step === 1 && "Select a Template"}
            {step === 2 && "Name your website"}
            {step === 3 && "Confirm & Launch"}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6">
            {step === 1 && (
                <div className="grid grid-cols-2 gap-4">
                    {themes.map(theme => (
                        <div
                            key={theme.id}
                            className={cn(
                                "border-2 rounded-xl p-4 cursor-pointer transition-all",
                                selectedTheme?.id === theme.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                            )}
                            onClick={() => setSelectedTheme(theme)}
                        >
                            <div className="aspect-video bg-surface rounded-lg mb-3 flex items-center justify-center">
                                <Palette className="h-8 w-8 text-muted-foreground/20" />
                            </div>
                            <p className="font-semibold text-sm">{theme.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{theme.description}</p>
                            {selectedTheme?.id === theme.id && (
                                <div className="mt-2 flex items-center text-primary text-xs font-medium">
                                    <Check className="h-3 w-3 mr-1" /> Selected
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="siteName">Site Name</Label>
                        <Input
                            id="siteName"
                            value={siteName}
                            onChange={(e) => {
                                setSiteName(e.target.value);
                                if (!subdomain) setSubdomain(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                            }}
                            placeholder="My Awesome Site"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subdomain">Choose your link</Label>
                        <div className="flex items-center">
                            <Input
                                id="subdomain"
                                value={subdomain}
                                onChange={(e) => setSubdomain(e.target.value)}
                                className="rounded-r-none"
                                placeholder="my-site"
                            />
                            <span className="bg-surface border border-l-0 border-border px-3 py-2 text-sm text-muted-foreground rounded-r-md">
                                .frontbacked.com
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Your site will be available at this address instantly.</p>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="text-center space-y-6">
                    <div className="bg-primary/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto text-primary">
                        <Globe className="h-10 w-10" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold">{siteName}</h3>
                        <p className="text-muted-foreground">{subdomain}.frontbacked.com</p>
                    </div>
                    <div className="bg-surface p-4 rounded-lg flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Theme:</span>
                        <span className="font-medium">{selectedTheme?.name}</span>
                    </div>
                </div>
            )}
        </div>

        <DialogFooter>
            {step > 1 && (
                <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={loading}>Back</Button>
            )}
            {step < 3 ? (
                <Button
                    onClick={() => setStep(step + 1)}
                    disabled={(step === 1 && !selectedTheme) || (step === 2 && (!siteName || !subdomain))}
                >
                    Continue
                </Button>
            ) : (
                <Button onClick={handleCreate} disabled={loading}>
                    {loading ? "Launching..." : "Launch My Site"}
                </Button>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
