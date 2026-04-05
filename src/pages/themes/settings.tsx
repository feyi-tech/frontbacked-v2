import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { themesApi } from '@/api/themes';
import { githubApi } from '@/api/github';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { Github, Upload, Loader2, Globe, FileText, Settings, History, Plus, Trash2 } from 'lucide-react';
import { Theme, Repo } from '@/types/api';
import Head from 'next/head';
import { Pagination } from '@/compos/components/Pagination';

const ThemeSettingsPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [theme, setTheme] = useState<Theme | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Tab states
    const [repos, setRepos] = useState<Repo[]>([]);
    const [repoHistory, setRepoHistory] = useState<any[]>([]);
    const [historyPage, setHistoryPage] = useState(1);
    const [totalHistoryPages, setTotalHistoryPages] = useState(1);
    const [customDomains, setCustomDomains] = useState<any[]>([]);
    const [newDomain, setNewDomain] = useState('');
    const [categories, setCategories] = useState<any[]>([]);
    const [subcategories, setSubcategories] = useState<any[]>([]);

    useEffect(() => {
        if (id) {
            fetchTheme();
            themesApi.getCategories().then(setCategories).catch(console.error);
        }
    }, [id]);

    const fetchTheme = async () => {
        setLoading(true);
        try {
            const data = await themesApi.get(id as string);
            setTheme(data);
            if (data.category) {
                const subs = await themesApi.getSubcategories(data.category);
                setSubcategories(subs);
            }
            fetchHistory();
        } catch (error) {
            toast.error("Failed to fetch theme");
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        if (!id) return;
        try {
            const historyResponse = await themesApi.getRepoHistory(id as string, historyPage);
            setRepoHistory(historyResponse.history);
            setTotalHistoryPages(historyResponse.totalPages);
        } catch (error) {
            console.error("Failed to fetch history", error);
        }
    };

    useEffect(() => {
        if (id) fetchHistory();
    }, [historyPage]);

    const handleUpdateSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!theme) return;
        setSaving(true);
        try {
            await themesApi.updateSettings(theme.id, theme);
            toast.success("Settings updated successfully");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || !theme) return;
        const summary = prompt("Please provide a summary of the features added:");
        if (!summary) return;

        const fd = new FormData();
        Array.from(files).forEach(f => fd.append('files', f));
        fd.append('summary', summary);

        try {
            await themesApi.upload(theme.id, fd);
            toast.success("Files uploaded successfully");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    if (loading) return (
        <DashboardLayout>
            <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
        </DashboardLayout>
    );

    if (!theme) return null;

    return (
        <DashboardLayout>
            <Head>
                <title>{theme.name} Settings | FrontBacked</title>
            </Head>

            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">{theme.name}</h1>
                    <p className="text-muted-foreground">Manage your theme settings and integrations.</p>
                </div>

                <Tabs defaultValue="info" className="space-y-6">
                    <TabsList className="bg-card border border-border">
                        <TabsTrigger value="info"><Settings className="mr-2 h-4 w-4" /> Info</TabsTrigger>
                        <TabsTrigger value="domains"><Globe className="mr-2 h-4 w-4" /> Domains</TabsTrigger>
                        <TabsTrigger value="github"><Github className="mr-2 h-4 w-4" /> GitHub</TabsTrigger>
                        <TabsTrigger value="files"><FileText className="mr-2 h-4 w-4" /> Files</TabsTrigger>
                    </TabsList>

                    <TabsContent value="info">
                        <form onSubmit={handleUpdateSettings} className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Theme Information</CardTitle>
                                    <CardDescription>Edit basic theme details.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Name</label>
                                        <Input
                                            value={theme.name}
                                            onChange={e => setTheme({...theme, name: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Description</label>
                                        <Textarea
                                            value={theme.description}
                                            onChange={e => setTheme({...theme, description: e.target.value})}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <p className="font-medium">Visibility</p>
                                                <p className="text-xs text-muted-foreground">{theme.visibility === 'public' ? 'Public' : 'Private'}</p>
                                            </div>
                                            <Switch
                                                checked={theme.visibility === 'public'}
                                                onCheckedChange={(v) => setTheme({...theme, visibility: v ? 'public' : 'private'})}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <p className="font-medium">Active Status</p>
                                                <p className="text-xs text-muted-foreground">Turn theme on/off</p>
                                            </div>
                                            <Switch
                                                checked={true} // Assuming active by default for now
                                                onCheckedChange={(v) => {}}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" disabled={saving}>
                                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Changes
                                    </Button>
                                </CardFooter>
                            </Card>
                        </form>
                    </TabsContent>

                    <TabsContent value="domains">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>System Subdomain</CardTitle>
                                    <CardDescription>Your theme's auto-generated preview URL.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between p-3 bg-surface rounded-lg border">
                                        <code className="text-primary">{theme.name.toLowerCase().replace(/\s/g, '-')}.frontbacked.com</code>
                                        <Button variant="ghost" size="sm">Copy</Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Custom Domains</CardTitle>
                                    <CardDescription>Connect your own domain to this theme.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="example.com"
                                            value={newDomain}
                                            onChange={e => setNewDomain(e.target.value)}
                                        />
                                        <Button onClick={async () => {
                                            try {
                                                await themesApi.addCustomDomain(theme.id, newDomain);
                                                toast.success("Domain added");
                                                setNewDomain('');
                                                fetchTheme();
                                            } catch (e: any) { toast.error(e.message); }
                                        }}>Add</Button>
                                    </div>
                                    {/* List custom domains here */}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="github">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Repository Sync</CardTitle>
                                    <CardDescription>Connect a GitHub repository to automatically update your theme.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="outline" className="w-full">
                                        <Github className="mr-2 h-4 w-4" />
                                        Connect Repository
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Pull History</CardTitle>
                                    <CardDescription>History of repository syncs.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        {repoHistory.map(entry => (
                                            <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div className="space-y-1">
                                                    <p className="font-medium">{entry.commitMessage}</p>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <span>{entry.author}</span>
                                                        <span>•</span>
                                                        <span>{new Date(entry.timestamp).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-semibold text-green-500 uppercase">Synced</p>
                                                    <p className="text-[10px] text-muted-foreground">Backend updated at {new Date(entry.updatedAt).toLocaleTimeString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {repoHistory.length === 0 && <p className="text-center text-muted-foreground py-4">No sync history available.</p>}
                                    </div>
                                    <Pagination
                                        page={historyPage}
                                        totalPages={totalHistoryPages}
                                        onPageChange={setHistoryPage}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="files">
                        <Card>
                            <CardHeader>
                                <CardTitle>Manual File Upload</CardTitle>
                                <CardDescription>Update your theme by uploading files directly.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className="border-2 border-dashed border-border rounded-xl p-12 text-center space-y-4 cursor-pointer hover:bg-surface transition-colors"
                                    onClick={() => document.getElementById('settings-file-upload')?.click()}
                                >
                                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                                    <p className="font-medium">Click to upload files</p>
                                    <p className="text-xs text-muted-foreground">You can update files even if GitHub is connected.</p>
                                    <input
                                        id="settings-file-upload"
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={handleFileUpload}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
};

export default ThemeSettingsPage;
