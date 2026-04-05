import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { themesApi } from '@/api/themes';
import { sitesApi } from '@/api/sites';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { Loader2, Globe, Palette, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Theme } from '@/types/api';
import Meta from '@/compos/components/Meta';
import { getSubDomainHost } from '@/compos/app-config';

const CreateSitePage = () => {
    const router = useRouter();
    const { theme_id } = router.query;
    const [theme, setTheme] = useState<Theme | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [subdomain, setSubdomain] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchingTheme, setFetchingTheme] = useState(true);

    useEffect(() => {
        if (theme_id) {
            setFetchingTheme(true);
            themesApi.get(theme_id as string)
                .then(setTheme)
                .catch(err => {
                    toast.error("Theme not found");
                    router.push('/themes');
                })
                .finally(() => setFetchingTheme(false));
        } else if (router.isReady) {
            router.push('/themes');
        }
    }, [theme_id, router.isReady]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!theme) return;

        setLoading(true);
        try {
            await sitesApi.create({
                subdomain,
                themeId: theme.id,
                themePlan: "free",
                settings: {
                    name,
                    description,
                },
            });
            toast.success("Site launched successfully!");
            //router.push('/sites');
        } catch (error: any) {
            toast.error("Launch failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (fetchingTheme) {
        return (
            <DashboardLayout>
                <div className="flex justify-center py-20">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <>
            <Meta />
            <DashboardLayout>
                <div className="max-w-2xl mx-auto space-y-8">
                    <Button variant="ghost" onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>

                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tight">Launch Your New Site</h1>
                        <p className="text-muted-foreground">You're one step away from having your own professional website.</p>
                    </div>

                    <form onSubmit={handleCreate}>
                        <Card className="shadow-elegant border-border/60">
                            <CardHeader className="border-b border-border/40 bg-surface/30">
                                <CardTitle className="flex items-center gap-2">
                                    <Palette className="h-5 w-5 text-primary" />
                                    Selected Theme: {theme?.name}
                                </CardTitle>
                                <CardDescription>Configure your site details below.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Site Name</Label>
                                    <Input
                                        id="name"
                                        required
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                        }}
                                        onBlur={() => {
                                            if (!subdomain && name) setSubdomain(name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase());
                                        }}
                                        placeholder="My Awesome Site"
                                        className="h-12"
                                    />
                                    <p className="text-xs text-muted-foreground">This is the name that will appear on your site.</p>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="description">Site Description</Label>
                                    <Input
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Describe your site..."
                                        className="h-12"
                                    />
                                    <p className="text-xs text-muted-foreground">This is a brief description of your site.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subdomain">Choose Your Link</Label>
                                    <div className="flex items-center">
                                        <Input
                                            id="subdomain"
                                            required
                                            value={subdomain}
                                            onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
                                            className="h-12 rounded-r-none border-r-0"
                                            placeholder="my-site"
                                        />
                                        <div className="h-12 bg-muted/50 border border-border px-4 flex items-center text-sm font-medium text-muted-foreground rounded-r-md">
                                            .frontbacked.com
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Your site will be available at this address instantly.</p>
                                </div>

                                <div className="bg-primary/5 rounded-xl p-6 border border-primary/10 space-y-4">
                                    <h4 className="font-semibold text-sm flex items-center gap-2 text-primary">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Launch Summary
                                    </h4>
                                    <div className="grid gap-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Theme</span>
                                            <span className="font-medium">{theme?.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Site Name</span>
                                            <span className="font-medium">{name || "---"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Address</span>
                                            <span className="font-medium text-primary">{subdomain ? `${subdomain}.${getSubDomainHost()}` : "---"}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t border-border/40 bg-surface/30 p-6">
                                <Button type="submit" className="w-full h-12 text-lg font-bold shadow-glow" disabled={loading || !name || !subdomain}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Launching...
                                        </>
                                    ) : (
                                        <>
                                            <Globe className="mr-2 h-5 w-5" />
                                            Launch My Site
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
            </DashboardLayout>
        </>
    );
};

export default CreateSitePage;
