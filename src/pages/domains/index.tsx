import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Globe, CheckCircle2, XCircle, Copy, Info, Loader2, RefreshCw } from 'lucide-react';
import Head from 'next/head';
import { AddDomainModal } from '@/components/domains/AddDomainModal';
import { domainsApi } from '@/api/domains';
import { sitesApi } from '@/api/sites';
import { Domain, Site } from '@/types/api';
import { toast } from 'sonner';

const DomainsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sites, setSites] = useState<Site[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
        const sitesData = await sitesApi.list();
        setSites(sitesData.sites);
        // Assuming we can fetch all domains or per site
        // For simplicity, let's assume there's a list domains endpoint or we fetch per site
        const allDomains: Domain[] = [];
        for (const site of sitesData.sites) {
            // This is a placeholder as the exact API for listing all domains isn't in Step 8
            // but we can infer it or fetch per site.
        }
        setDomains(allDomains);
    } catch (error) {
        // demo data
        setSites([]);
        setDomains([{ id: "d1", siteId: "1", hostname: "myshop.com", verified: false, verificationToken: "fb-verify-12345" }]);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerify = async (id: string) => {
    setVerifying(id);
    try {
        await domainsApi.verify(id);
        toast.success("Domain verified successfully!");
        fetchData();
    } catch (error: any) {
        toast.error("Verification failed: " + error.message);
    } finally {
        setVerifying(null);
    }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Domains | FrontBacked</title>
      </Head>

      <div className="space-y-8">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Custom Domains</h1>
                <p className="text-muted-foreground">Manage and verify custom domains for your websites.</p>
            </div>
            <Button onClick={() => setIsModalOpen(true)} disabled={sites.length === 0}>
                <Plus className="mr-2 h-4 w-4" />
                Add Domain
            </Button>
        </div>

        {loading ? (
             <div className="flex justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
             </div>
        ) : domains.length === 0 ? (
            <Card className="bg-card border-border shadow-elegant">
                <CardHeader>
                    <CardTitle>No custom domains yet</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        Your site is already live with a free FrontBacked link.
                        Want a custom domain like <strong>yourbrand.com</strong>? Add it here.
                    </p>
                    <Button variant="outline" onClick={() => setIsModalOpen(true)} disabled={sites.length === 0}>
                        Add Your First Domain
                    </Button>
                </CardContent>
            </Card>
        ) : (
            <div className="space-y-6">
                {domains.map(domain => (
                    <Card key={domain.id} className="bg-card border-border shadow-elegant overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <Globe className="h-6 w-6 text-primary" />
                                    <div>
                                        <h3 className="text-lg font-bold">{domain.hostname}</h3>
                                        <p className="text-sm text-muted-foreground">Attached to: {sites.find(s => s.id === domain.siteId)?.name || 'Unknown'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {domain.verified ? (
                                        <span className="flex items-center text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded">
                                            <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-xs font-medium text-amber-500 bg-amber-50 px-2 py-1 rounded">
                                            <XCircle className="h-3 w-3 mr-1" /> Pending Verification
                                        </span>
                                    )}
                                </div>
                            </div>

                            {!domain.verified && (
                                <div className="space-y-4">
                                    <div className="bg-surface p-4 rounded-lg space-y-4">
                                        <h4 className="text-sm font-semibold flex items-center">
                                            <Info className="h-4 w-4 mr-2 text-primary" />
                                            DNS Configuration
                                        </h4>
                                        <p className="text-xs text-muted-foreground">Add the following TXT record to your domain's DNS settings at your registrar.</p>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Type</p>
                                                <code className="text-xs bg-background p-1 px-2 rounded border border-border block">TXT</code>
                                            </div>
                                            <div className="space-y-1 md:col-span-1">
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Name/Host</p>
                                                <div className="flex items-center justify-between bg-background p-1 px-2 rounded border border-border">
                                                    <code className="text-xs">@</code>
                                                    <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => copy("@")}><Copy className="h-2 w-2" /></Button>
                                                </div>
                                            </div>
                                            <div className="space-y-1 md:col-span-1">
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Value</p>
                                                <div className="flex items-center justify-between bg-background p-1 px-2 rounded border border-border">
                                                    <code className="text-xs truncate">{domain.verificationToken}</code>
                                                    <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => copy(domain.verificationToken)}><Copy className="h-2 w-2" /></Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button onClick={() => handleVerify(domain.id)} disabled={verifying === domain.id}>
                                            {verifying === domain.id ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                                            Verify Connection
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        )}

        <div className="max-w-3xl">
            <h2 className="text-xl font-bold mb-4">Domain Education</h2>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>What is a domain name?</AccordionTrigger>
                    <AccordionContent>
                        A domain name is your website's address on the internet (e.g., google.com).
                        It makes it easy for people to find your site.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>How do I get a domain name?</AccordionTrigger>
                    <AccordionContent>
                        You can buy a domain name from registrars like Namecheap, GoDaddy, or Cloudflare.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>How do I connect my domain?</AccordionTrigger>
                    <AccordionContent>
                        1. Add your domain in the dashboard.<br/>
                        2. Copy the DNS TXT record provided.<br/>
                        3. Go to your registrar and add the record.<br/>
                        4. Come back here and click "Verify Connection".
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
      </div>

      <AddDomainModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        siteId={sites[0]?.id || ""}
        onSuccess={fetchData}
      />
    </DashboardLayout>
  );
};

export default DomainsPage;
