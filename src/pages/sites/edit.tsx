import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sitesApi } from '@/api/sites';
import { themesApi } from '@/api/themes';
import { domainsApi } from '@/api/domains';
import { Site, Theme, ThemeVersion, Domain } from '@/types/api';
import { toast } from 'sonner';
import {
  Loader2,
  Globe,
  Palette,
  RefreshCw,
  ExternalLink,
  Plus,
  CheckCircle2,
  XCircle,
  BarChart3,
  Trash2
} from 'lucide-react';
import Meta from '@/compos/components/Meta';
import { cn } from '@/lib/utils';
import { Pagination } from '@/compos/components/Pagination';
import { SubscriptionModal } from '@/components/sites/SubscriptionModal';
import { DNSConfig } from '@/components/domains/DNSConfig';

const EditSitePage = () => {
    const router = useRouter();
    const { site_id } = router.query;
    const [site, setSite] = useState<Site | null>(null);
    const [theme, setTheme] = useState<Theme | null>(null);

    const [versions, setVersions] = useState<ThemeVersion[]>([]);
    const [versionPage, setVersionPage] = useState(1);
    const [totalVersionPages, setTotalVersionPages] = useState(1);
    const [versionsLoading, setVersionsLoading] = useState(false);

    const [domains, setDomains] = useState<Domain[]>([]);
    const [domainPage, setDomainPage] = useState(1);
    const [totalDomainPages, setTotalDomainPages] = useState(1);
    const [domainsLoading, setDomainsLoading] = useState(false);

    const [loading, setLoading] = useState(true);
    const [updatingVersion, setUpdatingVersion] = useState(false);
    const [newDomain, setNewDomain] = useState('');
    const [addingDomain, setAddingDomain] = useState(false);
    const [activeTab, setActiveTab] = useState('metrics');
    const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
    const [verifying, setVerifying] = useState<string | null>(null);

    const fetchSiteAndTheme = async () => {
        if (!site_id) return;
        setLoading(true);
        try {
            const siteData = await sitesApi.get(site_id as string);
            setSite(siteData);
            const themeData = await themesApi.get(siteData.themeId);
            setTheme(themeData);
        } catch (error: any) {
            toast.error("Failed to load site data");
        } finally {
            setLoading(false);
        }
    };

    const fetchVersions = async () => {
        if (!site) return;
        setVersionsLoading(true);
        try {
            const versionsResponse = await themesApi.getVersions(site.themeId, versionPage);
            setVersions(versionsResponse.versions);
            setTotalVersionPages(versionsResponse.totalPages);
        } catch (error: any) {
            toast.error("Failed to load versions");
        } finally {
            setVersionsLoading(false);
        }
    };

    const fetchDomains = async () => {
        if (!site_id) return;
        setDomainsLoading(true);
        try {
            const d = await sitesApi.getDomains(site_id as string, domainPage, 10);
            setDomains(d.domains);
            setTotalDomainPages(d.totalPages);
        } catch (e) {
            setDomains([]);
        } finally {
            setDomainsLoading(false);
        }
    };

    useEffect(() => {
        if (site_id) fetchSiteAndTheme();
    }, [site_id]);

    useEffect(() => {
        if (activeTab === 'versions' && site) {
            fetchVersions();
        }
    }, [activeTab, site, versionPage]);

    useEffect(() => {
        if (activeTab === 'domains' && site_id) {
            fetchDomains();
        }
    }, [activeTab, site_id, domainPage]);

    const handleUpdateVersion = async (versionId: string) => {
        if (!site || updatingVersion) return;
        setUpdatingVersion(true);
        try {
            await sitesApi.updateVersion(site.id, versionId);
            toast.success("Theme version updated!");
            setSite({ ...site, themeVersionId: versionId });
        } catch (error: any) {
            toast.error("Update failed: " + error.message);
        } finally {
            setUpdatingVersion(false);
        }
    };

    const handleAddDomain = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!site || !newDomain || addingDomain) return;
        setAddingDomain(true);
        try {
            await domainsApi.add(site.id, newDomain);
            toast.success("Domain added!");
            setNewDomain('');
            fetchDomains();
        } catch (error: any) {
            toast.error("Failed to add domain: " + error.message);
        } finally {
            setAddingDomain(false);
        }
    };

    const handleRemoveDomain = async (domainId: string) => {
        if (!site_id) return;
        try {
            await sitesApi.removeDomain(site_id as string, domainId);
            toast.success("Domain removed!");
            fetchDomains();
        } catch (error: any) {
            toast.error("Failed to remove domain: " + error.message);
        }
    }

    const handleVerify = async (id: string) => {
        setVerifying(id);
        try {
            await domainsApi.verify(id);
            toast.success("Domain verified!");
            fetchDomains();
        } catch (error: any) {
            toast.error("Verification failed: " + (error.message || "Please check your DNS records and try again."));
        } finally {
            setVerifying(null);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center py-20">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    if (!site) return null;

    return (
        <>
            <Meta />
            <DashboardLayout>
                <div className="space-y-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold">{site.name}</h1>
                            <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                <Globe className="h-4 w-4" />
                                <span>{site.subdomain}.frontbacked.com</span>
                                <a href={`https://${site.subdomain}.frontbacked.com`} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-sm font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full uppercase tracking-wider">
                                    Plan: {site.themePlan}
                                </span>
                                {site.themePlan === 'free' && (
                                    <Button size="sm" variant="destructive" onClick={() => setIsSubscriptionOpen(true)} className="h-7 text-xs">
                                        Remove Fake Site Warning
                                    </Button>
                                )}
                                {site.themePlan !== 'free' && site.themePlan !== 'purchased' && (
                                    <Button size="sm" variant="outline" onClick={() => setIsSubscriptionOpen(true)} className="h-7 text-xs">
                                        Change Subscription
                                    </Button>
                                )}
                            </div>
                        </div>
                        <Button variant="outline" asChild>
                            <a href={`https://${site.subdomain}.frontbacked.com/fb-admin`} target="_blank" rel="noreferrer">
                                Open Admin Dashboard
                            </a>
                        </Button>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="bg-muted/50 p-1">
                            <TabsTrigger value="metrics" className="gap-2">
                                <BarChart3 className="h-4 w-4" /> Metrics
                            </TabsTrigger>
                            <TabsTrigger value="domains" className="gap-2">
                                <Globe className="h-4 w-4" /> Custom Domain
                            </TabsTrigger>
                            <TabsTrigger value="versions" className="gap-2">
                                <RefreshCw className="h-4 w-4" /> Versions
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="metrics" className="space-y-6">
                            <Card className="border-border/60 shadow-elegant">
                                <CardHeader>
                                    <CardTitle>Site Traffic</CardTitle>
                                    <CardDescription>Monitor your site's performance and audience reach.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-border/40 rounded-xl m-6 mt-0 bg-surface/30">
                                    <div className="relative">
                                        <Globe className="h-24 w-24 text-muted-foreground/20 animate-pulse" />
                                        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-ping" />
                                        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-accent rounded-full animate-ping delay-300" />
                                    </div>
                                    <p className="text-muted-foreground mt-4 font-medium italic">Global Traffic Atlas Coming Soon</p>
                                    <p className="text-xs text-muted-foreground/60 max-w-xs text-center mt-2">
                                        Soon you'll be able to see real-time dots on the world map showing exactly where your visitors are coming from.
                                    </p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="domains" className="space-y-6">
                            <Card className="border-border/60 shadow-elegant">
                                <CardHeader>
                                    <CardTitle>Custom Domains</CardTitle>
                                    <CardDescription>Connect your own domain to your website.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <form onSubmit={handleAddDomain} className="flex gap-2">
                                        <Input
                                            placeholder="example.com"
                                            value={newDomain}
                                            onChange={(e) => setNewDomain(e.target.value)}
                                            className="max-w-md"
                                        />
                                        <Button type="submit" disabled={addingDomain}>
                                            {addingDomain ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                                            Add Domain
                                        </Button>
                                    </form>

                                    {domainsLoading ? (
                                        <div className="flex justify-center py-10">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {domains.length === 0 ? (
                                                <div className="text-center py-12 border rounded-xl bg-surface/20 border-dashed">
                                                    <p className="text-muted-foreground">No custom domains added yet.</p>
                                                </div>
                                            ) : (
                                                domains.map(domain => (
                                                    <div key={domain.id} className="p-4 border rounded-xl bg-card space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <Globe className="h-5 w-5 text-primary" />
                                                                <span className="font-bold">{domain.hostname}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {domain.verified ? (
                                                                    <span className="flex items-center text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                                                                        <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
                                                                    </span>
                                                                ) : (
                                                                    <span className="flex items-center text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full">
                                                                        <XCircle className="h-3 w-3 mr-1" /> Pending
                                                                    </span>
                                                                )}
                                                                <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => handleRemoveDomain(domain.id)}>
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
                                                ))
                                            )}
                                            <Pagination
                                                page={domainPage}
                                                totalPages={totalDomainPages}
                                                onPageChange={setDomainPage}
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="versions" className="space-y-6">
                            <Card className="border-border/60 shadow-elegant">
                                <CardHeader>
                                    <CardTitle>Theme Versioning</CardTitle>
                                    <CardDescription>Switch between different versions of your theme.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/10 rounded-xl mb-6">
                                        <Palette className="h-8 w-8 text-primary" />
                                        <div>
                                            <p className="text-sm font-medium text-primary uppercase tracking-wider">Active Theme</p>
                                            <p className="text-xl font-bold">{theme?.name}</p>
                                        </div>
                                    </div>

                                    {versionsLoading ? (
                                        <div className="flex justify-center py-10">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        </div>
                                    ) : (
                                        <>
                                            <div className="grid gap-3">
                                                {versions.map(v => (
                                                    <div
                                                        key={v.id}
                                                        className={cn(
                                                            "p-4 border rounded-xl flex items-center justify-between transition-all",
                                                            site.themeVersionId === v.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-surface/50"
                                                        )}
                                                    >
                                                        <div>
                                                            <p className="font-bold flex items-center gap-2">
                                                                Version {v.version}
                                                                {site.themeVersionId === v.id && <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full uppercase tracking-tighter">Current</span>}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">Released on {new Date(v.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                        <Button
                                                            size="sm"
                                                            variant={site.themeVersionId === v.id ? "ghost" : "outline"}
                                                            disabled={site.themeVersionId === v.id || updatingVersion}
                                                            onClick={() => handleUpdateVersion(v.id)}
                                                        >
                                                            {updatingVersion && site.themeVersionId !== v.id ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Switch to Version"}
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                            <Pagination
                                                page={versionPage}
                                                totalPages={totalVersionPages}
                                                onPageChange={setVersionPage}
                                            />
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </DashboardLayout>

            {site && (
                <SubscriptionModal
                    open={isSubscriptionOpen}
                    onOpenChange={setIsSubscriptionOpen}
                    siteId={site.id}
                    themeId={site.themeId}
                />
            )}
        </>
    );
};

export default EditSitePage;
