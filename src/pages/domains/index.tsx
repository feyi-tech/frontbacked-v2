import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Globe, CheckCircle2, XCircle, Info, Loader2, Trash2 } from 'lucide-react';
import Head from 'next/head';
import { domainsApi } from '@/api/domains';
import { sitesApi } from '@/api/sites';
import { Domain, Site } from '@/types/api';
import { toast } from 'sonner';
import { Pagination } from '@/compos/components/Pagination';
import { DNSConfig } from '@/components/domains/DNSConfig';

const DomainsPage = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSites = async () => {
      try {
          const sitesData = await sitesApi.list(1, 100);
          setSites(sitesData.sites);
      } catch (error) {
          console.error("Failed to fetch sites", error);
      }
  }

  const fetchDomains = async () => {
    setLoading(true);
    try {
        const domainsData = await domainsApi.list(page);
        setDomains(domainsData.domains);
        setTotalPages(domainsData.totalPages);
    } catch (error) {
        setDomains([]);
        setTotalPages(1);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  useEffect(() => {
    fetchDomains();
  }, [page]);

  const handleVerify = async (id: string) => {
    setVerifying(id);
    try {
        await domainsApi.verify(id);
        toast.success("Domain verified successfully!");
        fetchDomains();
    } catch (error: any) {
        toast.error("Verification failed: " + (error.message || "Please check your DNS records and try again."));
    } finally {
        setVerifying(null);
    }
  };

  const handleRemove = async (siteId: string, domainId: string) => {
    try {
        await sitesApi.removeDomain(siteId, domainId);
        toast.success("Domain removed successfully!");
        fetchDomains();
    } catch (error: any) {
        toast.error("Failed to remove domain: " + error.message);
    }
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
                        Your sites are already live with free FrontBacked links.
                        To add a custom domain, visit the settings for a specific site.
                    </p>
                    <Button variant="outline" asChild>
                      <a href="/sites">Go to Sites</a>
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
                                        <span className="flex items-center text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded">
                                            <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded">
                                            <XCircle className="h-3 w-3 mr-1" /> Pending Verification
                                        </span>
                                    )}
                                    <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => handleRemove(domain.siteId, domain.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {!domain.verified && (
                                <DNSConfig
                                    domain={domain}
                                    onVerify={handleVerify}
                                    isVerifying={verifying === domain.id}
                                />
                            )}
                        </div>
                    </Card>
                ))}
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>
        )}

        <div className="max-w-3xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Domain Education
            </h2>
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
                        1. Add your domain in the site's settings tab.<br/>
                        2. Copy the DNS TXT record provided.<br/>
                        3. Go to your registrar and add the record.<br/>
                        4. Come back here or to the site's settings and click "Verify Connection".
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DomainsPage;
