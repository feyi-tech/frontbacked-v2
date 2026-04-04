import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { themesApi } from '@/api/themes';
import { Theme } from '@/types/api';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, User as UserIcon, Heart, Globe, ArrowLeft, Palette } from 'lucide-react';
import Link from 'next/link';
import { ThemeReviews } from '@/components/themes/ThemeReviews';
import { useAuth } from '@/hooks/useAuth';
import Meta from '@/compos/components/Meta';
import PageContainer from '@/compos/components/PageContainer';

const ThemeDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading: authLoading } = useAuth();
  const [theme, setTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      themesApi.get(id as string)
        .then(setTheme)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const content = (
    <div className="max-w-6xl mx-auto space-y-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : theme ? (
        <div className="space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="aspect-video bg-surface rounded-2xl flex items-center justify-center border border-border shadow-elegant overflow-hidden">
                  <Palette className="h-24 w-24 text-muted-foreground/10" />
              </div>
              <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl">
                  <div className="flex items-center space-x-2">
                      <Heart className="h-6 w-6 text-red-500 fill-current" />
                      <span className="font-bold text-lg">{theme.likes || 0} Likes</span>
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                      {theme.usageCount || 0} sites powered by this theme
                  </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold mb-4">{theme.name}</h1>
                <p className="text-xl text-muted-foreground leading-relaxed">{theme.description}</p>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-surface rounded-xl border border-border">
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                  <AvatarImage src={theme.author?.photo} />
                  <AvatarFallback>
                    <UserIcon className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Created By</p>
                  <p className="text-lg font-bold">{theme.author?.name || 'Anonymous'}</p>
                </div>
              </div>

              {theme.pricing && (
                  <div className="space-y-4">
                      <h3 className="font-bold text-lg">Pricing Plans</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 bg-card border border-border rounded-xl">
                              <p className="text-sm text-muted-foreground mb-1">Monthly</p>
                              <p className="text-2xl font-bold text-foreground">${theme.pricing.monthly}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                          </div>
                          <div className="p-4 bg-card border border-border rounded-xl">
                              <p className="text-sm text-muted-foreground mb-1">Yearly</p>
                              <p className="text-2xl font-bold text-foreground">${theme.pricing.yearly}<span className="text-sm font-normal text-muted-foreground">/yr</span></p>
                          </div>
                          <div className="p-6 bg-primary/10 border-2 border-primary/20 rounded-xl col-span-full flex justify-between items-center">
                              <div>
                                  <p className="text-sm text-primary font-bold uppercase tracking-widest mb-1">Best Value</p>
                                  <p className="text-3xl font-black text-primary">Lifetime Access</p>
                              </div>
                              <p className="text-4xl font-black text-primary">${theme.pricing.purchase}</p>
                          </div>
                      </div>
                  </div>
              )}

              <Button size="lg" className="w-full h-16 text-lg font-bold shadow-glow" asChild>
                <Link href={`/sites/create?theme_id=${theme.id}`}>
                  <Globe className="mr-2 h-6 w-6" />
                  Create Site with this Theme
                </Link>
              </Button>
            </div>
          </div>

          <div className="pt-12 border-t border-border">
              <h3 className="text-3xl font-bold mb-8">User Reviews</h3>
              <ThemeReviews themeId={theme.id} totalLikes={theme.likes || 0} />
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">Theme not found</h2>
        </div>
      )}
    </div>
  );

  if (authLoading) return null;

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

export default ThemeDetailsPage;
