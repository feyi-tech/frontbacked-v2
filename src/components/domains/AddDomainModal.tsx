import React, { useState } from 'react';
import { domainsApi } from '@/api/domains';
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
import { toast } from 'sonner';
import { Copy, Info, Loader2 } from 'lucide-react';
import { Domain } from '@/types/api';

interface AddDomainModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteId: string;
  onSuccess: (domain: Domain) => void;
}

export const AddDomainModal = ({ open, onOpenChange, siteId, onSuccess }: AddDomainModalProps) => {
  const [hostname, setHostname] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    try {
      const domain = await domainsApi.add(siteId, hostname);
      toast.success("Domain added! Now follow verification steps.");
      onSuccess(domain);
      onOpenChange(false);
      setHostname('');
    } catch (error: any) {
      toast.error("Failed to add domain: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Custom Domain</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex gap-3 text-blue-800 text-sm">
                <Info className="h-5 w-5 shrink-0" />
                <p>Enter the domain name you own. You'll need to update your DNS settings after adding it.</p>
            </div>
            <div className="space-y-2">
                <Label htmlFor="hostname">Domain Name</Label>
                <Input
                    id="hostname"
                    value={hostname}
                    onChange={(e) => setHostname(e.target.value)}
                    placeholder="example.com"
                />
            </div>
        </div>
        <DialogFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!hostname || loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Add Domain
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
