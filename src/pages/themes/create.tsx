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
import { useQueryError } from '@/compos/hooks/useQueryError';
import useGithub from '@/compos/hooks/useGithub';
import { getVisiblePages } from '@/compos/utils';

// (imports unchanged)

const MAX_NAME = 80;
const MAX_DESCRIPTION = 500;

const CreateThemePage = () => {

    useQueryError();
    const { connect } = useGithub();
    const router = useRouter();

    const [step, setStep] = useState<'selection' | 'info'>('selection');
    const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);

    const [repos, setRepos] = useState<Repo[]>([]);
    const [loadingRepos, setLoadingRepos] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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
        fetchRepos(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);

    const fetchRepos = async (pageNumber: number) => {
        setLoadingRepos(true);
        try {
            const data = await githubApi.listRepos(pageNumber);
            setRepos(data.repos);
            setTotalPages(data.totalPages);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoadingRepos(false);
        }
    };

    const handlePriceInput = (field: keyof typeof formData.pricing, value: number) => {
        setFormData(prev => ({
            ...prev,
            pricing: {
                ...prev.pricing,
                [field]: value
            }
        }));
    };

    const suggestPrices = (field: keyof typeof formData.pricing) => {

        const pricing = { ...formData.pricing };
        const value = pricing[field];

        if (!value) return;

        let monthly = value;

        if (field === "quarterly") monthly = value / (3 * 0.85);
        if (field === "yearly") monthly = value / (12 * 0.7);
        if (field === "purchase") monthly = value / 24;

        const suggestions = {
            monthly,
            quarterly: monthly * 3 * 0.85,
            yearly: monthly * 12 * 0.7,
            purchase: monthly * 24
        };

        for (const key of Object.keys(pricing) as (keyof typeof pricing)[]) {

            if (key === field) continue;

            if (!pricing[key]) {
                pricing[key] = parseFloat(suggestions[key].toFixed(2));
            }

        }

        setFormData(prev => ({
            ...prev,
            pricing
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        setIsSubmitting(true);

        try {

            if (uploadedFiles) {

                const fd = new FormData();

                fd.append('name', formData.name);
                fd.append('description', formData.description);
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
                <p className="text-muted-foreground">
                    Share your design with the world.
                </p>
            </div>

            {step === 'selection' ? (

                /* SELECTION STEP (unchanged except formatting) */

                <Card>
                    <CardHeader>
                        <CardTitle>Source Code</CardTitle>
                        <CardDescription>
                            Choose how you want to provide your theme files.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>

                        <Tabs defaultValue="github">

                            <TabsList className="grid grid-cols-2 w-full">
                                <TabsTrigger value="github">
                                    <Github className="mr-2 h-4 w-4" />
                                    GitHub
                                </TabsTrigger>

                                <TabsTrigger value="upload">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Files
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="github" className="pt-4 space-y-4">

                                {loadingRepos ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="animate-spin" />
                                    </div>
                                ) : repos.length > 0 ? (

                                    <>
                                    <div className="grid gap-2">

                                        {repos.map(repo => (

                                            <div
                                                key={repo.id}
                                                className={`p-3 border rounded-lg cursor-pointer hover:border-primary transition-colors ${
                                                    selectedRepo?.id === repo.id
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border"
                                                }`}
                                                onClick={() => setSelectedRepo(repo)}
                                            >
                                                <p className="font-medium">
                                                    {repo.full_name}
                                                </p>

                                                <p className="text-xs text-muted-foreground">
                                                    {repo.description}
                                                </p>
                                            </div>

                                        ))}

                                    </div>

                                    {totalPages > 1 && (
                                        <div className="flex justify-center gap-2 pt-4 flex-wrap">

                                            <Button
                                                variant="outline"
                                                disabled={page === 1}
                                                onClick={() => setPage(page - 1)}
                                            >
                                                Previous
                                            </Button>

                                            {getVisiblePages(page, totalPages).map((p, i) => {

                                                if (p === "...") {
                                                    return (
                                                        <span
                                                            key={i}
                                                            className="px-2 text-muted-foreground flex items-center"
                                                        >
                                                            ...
                                                        </span>
                                                    );
                                                }

                                                return (
                                                    <Button
                                                        key={p}
                                                        variant={p === page ? "default" : "outline"}
                                                        onClick={() => setPage(p as number)}
                                                    >
                                                        {p}
                                                    </Button>
                                                );
                                            })}

                                            <Button
                                                variant="outline"
                                                disabled={page === totalPages}
                                                onClick={() => setPage(page + 1)}
                                            >
                                                Next
                                            </Button>

                                        </div>
                                    )}

                                    </>

                                ) : (

                                    <div className="text-center py-8 space-y-4">
                                        <p className="text-muted-foreground">
                                            No repositories found or GitHub not connected.
                                        </p>

                                        <Button
                                            variant="outline"
                                            onClick={connect}
                                        >
                                            Connect GitHub
                                        </Button>
                                    </div>

                                )}

                            </TabsContent>

                            <TabsContent value="upload" className="pt-4">

                                <div className="border-2 border-dashed rounded-xl p-12 text-center space-y-4">

                                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />

                                    <Button
                                        variant="outline"
                                        onClick={() => document.getElementById("file-upload")?.click()}
                                    >
                                        Select Files
                                    </Button>

                                    <input
                                        id="file-upload"
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => setUploadedFiles(e.target.files)}
                                    />

                                    {uploadedFiles && (
                                        <p className="text-sm font-medium">
                                            {uploadedFiles.length} files selected
                                        </p>
                                    )}

                                    <p className="text-xs text-muted-foreground">
                                        Upload a .zip or individual theme files.
                                    </p>

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

                /* INFORMATION STEP */

                <form onSubmit={handleSubmit} className="space-y-6">

                    <Card>
                        <CardHeader>
                            <CardTitle>Theme Information</CardTitle>
                            <CardDescription>
                                Provide details that will help users discover your theme.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">

                            {/* THEME NAME */}

                            <div className="space-y-2">

                                <label className="text-sm font-medium">
                                    Theme Name
                                </label>

                                <Input
                                    required
                                    maxLength={MAX_NAME}
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value
                                        })
                                    }
                                    placeholder="e.g. Minimalist SaaS Dashboard"
                                />

                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>
                                        Keep it short and descriptive.
                                    </span>
                                    <span>
                                        {MAX_NAME - formData.name.length} characters left
                                    </span>
                                </div>

                            </div>

                            {/* DESCRIPTION */}

                            <div className="space-y-2">

                                <label className="text-sm font-medium">
                                    Description
                                </label>

                                <Textarea
                                    required
                                    maxLength={MAX_DESCRIPTION}
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value
                                        })
                                    }
                                    placeholder="Explain what makes this theme special and what type of websites it is suitable for."
                                />

                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>
                                        Describe the purpose, style and ideal use case.
                                    </span>
                                    <span>
                                        {MAX_DESCRIPTION - formData.description.length} characters left
                                    </span>
                                </div>

                            </div>

                        </CardContent>
                    </Card>

                    {/* PRICING */}

                    <Card>

                        <CardHeader>
                            <CardTitle>Pricing (USD)</CardTitle>
                            <CardDescription>
                                Enter any price and the rest will be suggested automatically.
                                Suggested prices are based on common SaaS pricing ratios.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="grid grid-cols-2 gap-6">

                            {(["monthly","quarterly","yearly","purchase"] as const).map((field) => {

                                const labelMap = {
                                    monthly: "Monthly",
                                    quarterly: "Quarterly",
                                    yearly: "Yearly",
                                    purchase: "Lifetime Purchase"
                                }

                                const helperMap = {
                                    monthly: "Recurring monthly subscription price.",
                                    quarterly: "Suggested 15% discount vs monthly.",
                                    yearly: "Suggested 30% discount vs monthly.",
                                    purchase: "One-time lifetime purchase price."
                                }

                                return (

                                    <div key={field} className="space-y-2">

                                        <label className="text-sm font-medium">
                                            {labelMap[field]}
                                        </label>

                                        <Input
                                            type="number"
                                            value={formData.pricing[field]}
                                            onChange={(e) =>
                                                handlePriceInput(
                                                    field,
                                                    parseFloat(e.target.value) || 0
                                                )
                                            }
                                            onBlur={() => suggestPrices(field)}
                                            onMouseUp={() => suggestPrices(field)}
                                        />

                                        <p className="text-xs text-muted-foreground">
                                            {helperMap[field]}
                                        </p>

                                    </div>

                                )

                            })}

                        </CardContent>

                    </Card>

                    <div className="flex items-start gap-2 p-4 bg-primary/5 border border-primary/20 rounded-lg text-sm text-primary">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p>
                            Theme information and pricing can be updated later.
                        </p>
                    </div>

                    <div className="flex gap-4">

                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setStep("selection")}
                        >
                            Back
                        </Button>

                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
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