import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Users, Plus, Github, History, Loader2 } from 'lucide-react';
import Head from 'next/head';
import { CreateThemeModal } from '@/components/themes/CreateThemeModal';
import { ConnectGithubModal } from '@/components/github/ConnectGithubModal';
import { themesApi } from '@/api/themes';
import { Theme } from '@/types/api';
import { toast } from 'sonner';

const ThemesPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchThemes = async () => {
    setLoading(true);
    try {
        const data = await themesApi.list();
        setThemes(data);
    } catch (error: any) {
        // toast.error("Failed to load themes");
        // Fallback mock for demo if API is not yet available
        setThemes([
            { id: "1", name: "Modern Business", description: "Clean and professional design", visibility: "public", creatorId: "1", createdAt: new Date().toISOString() },
            { id: "2", name: "Personal Blog", description: "A simple blog theme", visibility: "public", creatorId: "1", createdAt: new Date().toISOString() }
        ]);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  return (
    <DashboardLayout>
      <Head>
        <title>Themes | FrontBacked</title>
      </Head>

      <div className="space-y-8">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Theme Marketplace</h1>
                <p className="text-muted-foreground">Choose a template to start building your site.</p>
            </div>
            <div className="flex gap-4">
                <Button variant="outline" onClick={() => { setSelectedThemeId(null); setIsGithubModalOpen(true); }}>
                    <Github className="mr-2 h-4 w-4" />
                    Connect Repo
                </Button>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Theme
                </Button>
            </div>
        </div>

        {loading ? (
            <div className="flex justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {themes.map((theme) => (
                    <Card key={theme.id} className="overflow-hidden group hover:shadow-glow transition-all duration-300">
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
                                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                    <span>4.8</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Users className="h-3 w-3" />
                                    <span>1.2k</span>
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-primary">
                                    {['Free', 'Monthly', 'Purchased'][Math.floor(Math.random() * 3)]}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                            <Button className="flex-1">Create Site</Button>
                            <Button variant="outline" size="icon" title="Version History">
                                <History className="h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )}
      </div>

      <CreateThemeModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={fetchThemes}
      />

      <ConnectGithubModal
        open={isGithubModalOpen}
        onOpenChange={setIsGithubModalOpen}
        themeId={selectedThemeId}
        onSuccess={fetchThemes}
      />
    </DashboardLayout>
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
