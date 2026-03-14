import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { themesApi } from '@/api/themes';
import { githubApi } from '@/api/github';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { Github, Upload, Loader2, AlertCircle } from 'lucide-react';
import { Repo } from '@/types/api';
import Head from 'next/head';

const CreateThemePage = () => {
  const router = useRouter();
  const [step, setStep] = useState<'selection' | 'info'>('selection');
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    subcategoryId: '',
    pricing: {
        monthly: 0,
        quarterly: 0,
        yearly: 0,
        purchase: 0
    }
  });

  useEffect(() => {
    themesApi.getCategories().then(setCategories).catch(console.error);
    fetchRepos();
  }, []);

  const fetchRepos = async () => {
    setLoadingRepos(true);
    try {
        const data = await githubApi.listRepos();
        setRepos(data);
    } catch (error) {
        console.error("Failed to fetch repos", error);
    } finally {
        setLoadingRepos(false);
    }
  };

  const handleCategoryChange = async (catId: string) => {
    setFormData({ ...formData, categoryId: catId, subcategoryId: '' });
    setLoadingSubcategories(true);
    try {
        const subs = await themesApi.getSubcategories(catId);
        setSubcategories(subs);
    } catch (error) {
        toast.error("Failed to fetch subcategories");
    } finally {
        setLoadingSubcategories(false);
    }
  };

  const handlePriceChange = (field: keyof typeof formData.pricing, value: number) => {
    const newPricing = { ...formData.pricing, [field]: value };

    // Suggested pricing logic
    if (field === 'monthly') {
        newPricing.quarterly = parseFloat((value * 3 * 0.85).toFixed(2)); // 15% discount
        newPricing.yearly = parseFloat((value * 12 * 0.7).toFixed(2));    // 30% discount
        newPricing.purchase = parseFloat((value * 24).toFixed(2));        // 2 years worth for lifetime
    }

    setFormData({ ...formData, pricing: newPricing });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        if (uploadedFiles) {
            const fd = new FormData();
            fd.append('name', formData.name);
            fd.append('description', formData.description);
            fd.append('categoryId', formData.categoryId);
            fd.append('subcategoryId', formData.subcategoryId);
            fd.append('pricing', JSON.stringify(formData.pricing));
            Array.from(uploadedFiles).forEach(file => fd.append('files', file));
            await themesApi.createUpload(fd);
        } else if (selectedRepo) {
            await themesApi.createRepo({
                ...formData,
                repoId: selectedRepo.id
            });
        }
        toast.success("Theme created successfully!");
        router.push('/themes');
    } catch (error: any) {
        toast.error(error.message || "Failed to create theme");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Create Theme | FrontBacked</title>
      </Head>

      <div className="max-w-4xl mx-auto space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Create New Theme</h1>
            <p className="text-muted-foreground">Share your design with the world.</p>
        </div>

        {step === 'selection' ? (
            <Card>
                <CardHeader>
                    <CardTitle>Source Code</CardTitle>
                    <CardDescription>Choose how you want to provide your theme files.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="github" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="github">
                                <Github className="mr-2 h-4 w-4" /> GitHub
                            </TabsTrigger>
                            <TabsTrigger value="upload">
                                <Upload className="mr-2 h-4 w-4" /> Upload Files
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="github" className="space-y-4 pt-4">
                            {loadingRepos ? (
                                <div className="flex justify-center py-8"><Loader2 className="animate-spin" /></div>
                            ) : repos.length > 0 ? (
                                <div className="grid grid-cols-1 gap-2">
                                    {repos.map(repo => (
                                        <div
                                            key={repo.id}
                                            className={`p-3 border rounded-lg cursor-pointer hover:border-primary transition-colors ${selectedRepo?.id === repo.id ? 'border-primary bg-primary/5' : 'border-border'}`}
                                            onClick={() => setSelectedRepo(repo)}
                                        >
                                            <p className="font-medium">{repo.full_name}</p>
                                            <p className="text-xs text-muted-foreground">{repo.description}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 space-y-4">
                                    <p className="text-muted-foreground">No repositories found or GitHub not connected.</p>
                                    <Button variant="outline" onClick={() => router.push('/github/callback')}>Connect GitHub</Button>
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="upload" className="pt-4">
                            <div className="border-2 border-dashed border-border rounded-xl p-12 text-center space-y-4">
                                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                                <div>
                                    <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                                        Select Files
                                    </Button>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => setUploadedFiles(e.target.files)}
                                    />
                                </div>
                                {uploadedFiles && <p className="text-sm font-medium">{uploadedFiles.length} files selected</p>}
                                <p className="text-xs text-muted-foreground">Upload a .zip or individual theme files</p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full"
                        disabled={!selectedRepo && !uploadedFiles}
                        onClick={() => setStep('info')}
                    >
                        Continue
                    </Button>
                </CardFooter>
            </Card>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Theme Information</CardTitle>
                        <CardDescription>Details about your theme.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Theme Name</label>
                            <Input
                                required
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                placeholder="e.g. Minimalist SaaS"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                required
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                placeholder="Describe what makes this theme special..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <Select required onValueChange={handleCategoryChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Subcategory</label>
                                <Select
                                    disabled={!formData.categoryId || loadingSubcategories}
                                    onValueChange={val => setFormData({...formData, subcategoryId: val})}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={loadingSubcategories ? "Loading..." : "Select Subcategory"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subcategories.map(sub => <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pricing (USD)</CardTitle>
                        <CardDescription>Set your theme's price. Enter monthly to see suggested values.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Monthly</label>
                            <Input
                                type="number"
                                value={formData.pricing.monthly}
                                onChange={e => handlePriceChange('monthly', parseFloat(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Quarterly</label>
                            <Input
                                type="number"
                                value={formData.pricing.quarterly}
                                onChange={e => handlePriceChange('quarterly', parseFloat(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Yearly</label>
                            <Input
                                type="number"
                                value={formData.pricing.yearly}
                                onChange={e => handlePriceChange('yearly', parseFloat(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Purchase Price (Lifetime)</label>
                            <Input
                                type="number"
                                value={formData.pricing.purchase}
                                onChange={e => handlePriceChange('purchase', parseFloat(e.target.value))}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-start gap-2 p-4 bg-primary/5 border border-primary/20 rounded-lg text-sm text-primary">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p>Theme information can be edited later.</p>
                </div>

                <div className="flex gap-4">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setStep('selection')}>Back</Button>
                    <Button type="submit" className="flex-1" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Create Theme
                    </Button>
                </div>
            </form>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CreateThemePage;
