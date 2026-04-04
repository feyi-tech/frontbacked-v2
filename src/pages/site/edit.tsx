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
import { apiClient } from '@/api/client';
import { Site, Theme, ThemeVersion, Domain } from '@/types/api';
import { toast } from 'sonner';
import {
  Loader2,
  Settings,
  BarChart3,
  Globe,
  Palette,
  RefreshCw,
  ExternalLink,
  Plus,
  CheckCircle2,
  XCircle,
  Copy,
  Info
} from 'lucide-react';
import Meta from '@/compos/components/Meta';
import { cn } from '@/lib/utils';

const EditSitePage = () => {
    const router = useRouter();
    const { site_id } = router.query;
    const [site, setSite] = useState<Site | null>(null);
    const [theme, setTheme] = useState<Theme | null>(null);
    const [versions, setVersions] = useState<ThemeVersion[]>([]);
    const [domains, setDomains] = useState<Domain[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingVersion, setUpdatingVersion] = useState(false);
    const [newDomain, setNewDomain] = useState('');
    const [addingDomain, setAddingDomain] = useState(false);

    const fetchData = async () => {
        if (!site_id) return;
        setLoading(true);
        try {
            const siteData = await sitesApi.get(site_id as string);
            setSite(siteData);

            const [themeData, versionsData] = await Promise.all([
                themesApi.get(siteData.themeId),
                themesApi.getVersions(siteData.themeId)
            ]);
            setTheme(themeData);
            setVersions(versionsData);

            try {
                const d = await apiClient.get<Domain[]>(`/sites/${site_id}/domains`);
                setDomains(d);
            } catch (e) {
                setDomains([]);
            }

        } catch (error: any) {
            toast.error("Failed to load site data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (site_id) fetchData();
    }, [site_id]);

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
            fetchData();
        } catch (error: any) {
            toast.error("Failed to add domain: " + error.message);
        } finally {
            setAddingDomain(false);
        }
    };

    const handleVerify = async (id: string) => {
        try {
            await domainsApi.verify(id);
            toast.success("Domain verified!");
            fetchData();
        } catch (error: any) {
            toast.error("Verification failed: " + error.message);
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
                        </div>
                        <Button variant="outline" asChild>
                            <a href={`https://${site.subdomain}.frontbacked.com/fb-admin`} target="_blank" rel="noreferrer">
                                Open Admin Dashboard
                            </a>
                        </Button>
                    </div>

                    <Tabs defaultValue="metrics" className="space-y-6">
                        <TabsList className="bg-muted/50 p-1">
                            <TabsTrigger value="metrics" className="gap-2">
                                <BarChart3 className="h-4 w-4" /> Metrics
                            </TabsTrigger>
                            <TabsTrigger value="domains" className="gap-2">
                                <Globe className="h-4 w-4" /> Custom Domain
                            </TabsTrigger>
                            <TabsTrigger value="theme" className="gap-2">
                                <Palette className="h-4 w-4" /> Theme Settings
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
                                                        {domain.verified ? (
                                                            <span className="flex items-center text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                                                                <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full">
                                                                <XCircle className="h-3 w-3 mr-1" /> Pending
                                                            </span>
                                                        )}
                                                    </div>

                                                    {!domain.verified && (
                                                        <div className="bg-surface p-4 rounded-lg space-y-4 text-sm border border-border/40">
                                                            <div className="flex items-center gap-2 text-primary font-semibold">
                                                                <Info className="h-4 w-4" /> DNS Configuration
                                                            </div>
                                                            <p className="text-muted-foreground">Add the following TXT record to your DNS settings:</p>
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                                                                <div>
                                                                    <p className="text-[10px] text-muted-foreground mb-1 uppercase font-bold">Type</p>
                                                                    <div className="bg-background border rounded p-2">TXT</div>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] text-muted-foreground mb-1 uppercase font-bold">Host</p>
                                                                    <div className="bg-background border rounded p-2">@</div>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] text-muted-foreground mb-1 uppercase font-bold">Value</p>
                                                                    <div className="bg-background border rounded p-2 truncate">{domain.verificationToken}</div>
                                                                </div>
                                                            </div>
                                                            <Button size="sm" variant="outline" onClick={() => handleVerify(domain.id)} className="w-full">
                                                                Verify Connection
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="theme" className="space-y-6">
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
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </DashboardLayout>
        </>
    );
};

export default EditSitePage;
