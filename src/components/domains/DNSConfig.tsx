import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Info, ExternalLink, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Domain } from '@/types/api';
import { detectDNSProvider, DNSProviderInfo } from '@/lib/dns';
import { cn } from '@/lib/utils';

interface DNSConfigProps {
  domain: Domain;
  onVerify: (id: string) => Promise<void>;
  isVerifying: boolean;
  className?: string;
}

export const DNSConfig = ({ domain, onVerify, isVerifying, className }: DNSConfigProps) => {
  const [provider, setProvider] = useState<DNSProviderInfo | null>(null);
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    if (!domain.verified) {
      setDetecting(true);
      detectDNSProvider(domain.hostname)
        .then(setProvider)
        .finally(() => setDetecting(false));
    }
  }, [domain.hostname, domain.verified]);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleAutoAdd = () => {
    if (provider) {
      window.open(provider.url, '_blank');
    } else {
      // Fallback if provider not detected
      toast.info("Opening a search for your domain's DNS settings");
      window.open(`https://www.google.com/search?q=${domain.hostname}+dns+settings`, '_blank');
    }
  };

  return (
    <div className={cn("bg-surface p-4 rounded-lg space-y-4 border border-border/40", className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold flex items-center">
          <Info className="h-4 w-4 mr-2 text-primary" />
          DNS Configuration
        </h4>
        {provider && (
          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
            Provider: {provider.name}
          </span>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Add the following TXT record to your domain's DNS settings at your registrar to verify ownership.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-bold text-muted-foreground">Type</p>
          <div className="flex items-center justify-between bg-background p-1.5 px-2 rounded border border-border group">
            <code className="text-xs">TXT</code>
            <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => copy("TXT")}>
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-bold text-muted-foreground">Host</p>
          <div className="flex items-center justify-between bg-background p-1.5 px-2 rounded border border-border group">
            <code className="text-xs">@</code>
            <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => copy("@")}>
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-bold text-muted-foreground">Value</p>
          <div className="flex items-center justify-between bg-background p-1.5 px-2 rounded border border-border group overflow-hidden">
            <code className="text-xs truncate">{domain.verificationToken}</code>
            <Button variant="ghost" size="icon" className="h-5 w-5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => copy(domain.verificationToken)}>
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-2"
          onClick={handleAutoAdd}
          disabled={detecting}
        >
          {detecting ? <Loader2 className="h-3 w-3 animate-spin" /> : <ExternalLink className="h-3 w-3" />}
          {provider ? `Open ${provider.name} DNS` : 'Auto Add Record'}
        </Button>
        <Button
          size="sm"
          className="flex-1 gap-2"
          onClick={() => onVerify(domain.id)}
          disabled={isVerifying}
        >
          {isVerifying ? <RefreshCw className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
          Verify Connection
        </Button>
      </div>
    </div>
  );
};
