import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, SlidersHorizontal, Heart, Loader2 } from 'lucide-react';
import { themesApi } from '@/api/themes';
import { Theme } from '@/types/api';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import Meta from '@/compos/components/Meta';
import PageContainer from '@/compos/components/PageContainer';
import Link from 'next/link';

const ThemesPage = () => {
  const router = useRouter();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currency, setCurrency] = useState('USD');

  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [fetchingSubcategories, setFetchingSubcategories] = useState(false);

  const [filters, setFilters] = useState({
    onlyMine: false,
    usedByMe: false,
    activeOnly: false,
    privateOnly: false
  });

  const fetchThemes = async (pageNumber = 1) => {
    setLoading(true);
    try {
        const params: any = {
            page: pageNumber,
            search,
            minPrice,
            maxPrice,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            subcategory: selectedSubcategory !== 'all' ? selectedSubcategory : undefined,
            ...filters
        };
        const response = await themesApi.list(params);
        setThemes(response.themes || response);
        setTotalPages(response.totalPages || 1);
    } catch (error: any) {
        // toast.error("Failed to load themes");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchThemes(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, minPrice, maxPrice, selectedCategory, selectedSubcategory, filters]);

  useEffect(() => {
    fetchThemes(page);
  }, [page]);

  useEffect(() => {
    themesApi.getCategories().then(setCategories).catch(console.error);
  }, []);

  const handleCategoryChange = async (catId: string) => {
    setSelectedCategory(catId);
    setSelectedSubcategory('all');
    if (catId !== 'all') {
        setFetchingSubcategories(true);
        try {
            const subs = await themesApi.getSubcategories(catId);
            setSubcategories(subs);
        } catch (error) {
            toast.error("Failed to fetch subcategories");
        } finally {
            setFetchingSubcategories(false);
        }
    } else {
        setSubcategories([]);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const locale = navigator.language;
        if (locale.includes('NG')) setCurrency('NGN');
    }
  }, []);

  const { user, loading: authLoading } = useAuth();

  const content = (
    <div className="space-y-8">
        <div className="bg-card border border-border rounded-xl p-8 mb-4 text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Theme Marketplace</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                All themes have free versions. Premium plans can be paid in your currency of choice,
                including <span className="text-primary font-semibold">Nigerian Naira</span>.
            </p>
            <p className="text-sm text-muted-foreground">
                Showing prices in: <span className="font-bold">{user?.currency || currency}</span>
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-10"
                            placeholder={`Search themes...`}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4" /> Filters
                    </h3>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map(cat => (
                                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {fetchingSubcategories && (
                        <p className="text-xs text-primary animate-pulse">Fetching sub categories...</p>
                    )}

                    {!fetchingSubcategories && subcategories.length > 0 && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Subcategory</label>
                            <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Subcategories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Subcategories</SelectItem>
                                    {subcategories.map(sub => (
                                        <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Price Range (USD)</label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                placeholder="Min"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                            <span>-</span>
                            <Input
                                type="number"
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </div>
                    </div>

                    {user && (
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="onlyMine" checked={filters.onlyMine} onCheckedChange={(v: boolean) => setFilters({...filters, onlyMine: v})} />
                                <label htmlFor="onlyMine" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Show only themes I created
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="usedByMe" checked={filters.usedByMe} onCheckedChange={(v: boolean) => setFilters({...filters, usedByMe: v})} />
                                <label htmlFor="usedByMe" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Show themes used by my sites
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="activeOnly" checked={filters.activeOnly} onCheckedChange={(v: boolean) => setFilters({...filters, activeOnly: v})} />
                                <label htmlFor="activeOnly" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Show my active themes
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="privateOnly" checked={filters.privateOnly} onCheckedChange={(v: boolean) => setFilters({...filters, privateOnly: v})} />
                                <label htmlFor="privateOnly" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Show my private themes
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="lg:col-span-3">
                {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {themes.map((theme) => (
                    <Link key={theme.id} href={`/theme/details?id=${theme.id}`}>
                        <Card className="overflow-hidden group hover:shadow-glow transition-all duration-300 h-full">
                            <div className="aspect-video relative overflow-hidden bg-surface flex items-center justify-center">
                                <PaletteIcon className="h-12 w-12 text-muted-foreground/20" />
                            </div>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-start">
                                    <span className="truncate mr-2">{theme.name}</span>
                                    <span className="text-xs font-normal bg-primary/10 text-primary px-2 py-1 rounded">
                                        {theme.visibility}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground line-clamp-2">{theme.description}</p>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <div className="flex items-center space-x-1">
                                        <Heart className="h-3 w-3 text-red-500 fill-current" />
                                        <span>{theme.likes || 0}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Users className="h-3 w-3" />
                                        <span>{theme.usageCount || 0}</span>
                                    </div>
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-primary">
                                        {theme.price === 0 || theme.price === undefined ? 'Free' : `$${theme.price}`}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                    ))}
                </div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        <Button
                            variant="outline"
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                        >
                            Previous
                        </Button>
                        <div className="flex items-center px-4 font-medium">
                            Page {page} of {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </div>
    </div>
  );

  if (authLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return (
        <>
            <Meta />
            <DashboardLayout>
                {content}
            </DashboardLayout>
        </>
    );
  }
  
  return (
    <>
        <Meta />
        <PageContainer>
            {content}
        </PageContainer>
    </>
  );
};

const PaletteIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24" height="24"
        viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        className={className}
    >
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.707-.484 2.15-1.208.402-.666.902-1.192 1.5-1.542.675-.406 1.426-.533 2.261-.383 1.256.225 3.01.833 3.633-1.422C22.42 15.807 22 13.958 22 12c0-5.5-4.5-10-10-10Z"/>
    </svg>
);

export default ThemesPage;
