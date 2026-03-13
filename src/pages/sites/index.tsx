import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Globe, ExternalLink, Settings, Loader2, Copy } from 'lucide-react';
import Head from 'next/head';
import { sitesApi } from '@/api/sites';
import { Site } from '@/types/api';
import { CreateSiteWizard } from '@/components/sites/CreateSiteWizard';
import { SubscriptionModal } from '@/components/sites/SubscriptionModal';
import { toast } from 'sonner';
import Link from 'next/link';

const SitesPage = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  const fetchSites = async () => {
    setLoading(true);
    try {
        const data = await sitesApi.list();
        setSites(data);
    } catch (error: any) {
        // Fallback for demo
        // setSites([{ id: "1", name: "My Store", subdomain: "my-store-123", themeId: "1", themeVersionId: "1", ownerId: "1", createdAt: "" }]);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Sites | FrontBacked</title>
      </Head>

      <div className="space-y-8">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Your Sites</h1>
                <p className="text-muted-foreground">Manage and monitor your live websites.</p>
            </div>
            <Button onClick={() => setIsWizardOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Site
            </Button>
        </div>

        {loading ? (
            <div className="flex justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        ) : sites.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-20 text-center space-y-6 shadow-elegant">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-primary">
                    <Globe className="h-8 w-8" />
                </div>
                <div className="max-w-sm mx-auto space-y-2">
                    <h2 className="text-xl font-bold">No sites found</h2>
                    <p className="text-muted-foreground">You haven't created any sites yet. Pick a theme to get started.</p>
                </div>
                <Button onClick={() => setIsWizardOpen(true)}>Launch Your First Site</Button>
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {sites.map(site => (
                    <Card key={site.id} className="bg-card border-border shadow-elegant overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">{site.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">{site.subdomain}.frontbacked.com</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" onClick={() => window.open(`https://${site.subdomain}.frontbacked.com`, '_blank')}>
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={() => { setSelectedSiteId(site.id); setIsSubscriptionOpen(true); }}>
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-surface p-4 rounded-lg">
                                    <p className="text-xs text-muted-foreground mb-1">Your Website Link</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium truncate mr-2">{site.subdomain}.frontbacked.com</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(`https://${site.subdomain}.frontbacked.com`)}>
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="bg-surface p-4 rounded-lg">
                                    <p className="text-xs text-muted-foreground mb-1">Admin Dashboard</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium truncate mr-2">.../fb-admin</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(`https://${site.subdomain}.frontbacked.com/fb-admin`)}>
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-surface/50 border-t border-border flex justify-between py-3">
                            <span className="text-xs text-muted-foreground">Status: <span className="text-green-500 font-medium">Live</span></span>
                            <Button variant="link" size="sm" className="h-auto p-0 text-primary" asChild>
                                <Link href="/domains">Change Site Link</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )}
      </div>

      <CreateSiteWizard
        open={isWizardOpen}
        onOpenChange={setIsWizardOpen}
        onSuccess={fetchSites}
      />

      {selectedSiteId && (
          <SubscriptionModal
            open={isSubscriptionOpen}
            onOpenChange={setIsSubscriptionOpen}
            siteId={selectedSiteId}
          />
      )}
    </DashboardLayout>
  );
};

export default SitesPage;
