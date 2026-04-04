import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Star, Users, ArrowRight, Loader2, Palette } from 'lucide-react';
import Link from 'next/link';
import { themesApi } from '@/api/themes';
import { Theme } from '@/types/api';

const ThemesSection = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await themesApi.list({ limit: 6 });
        const themeList = response.themes || response;
        setThemes(Array.isArray(themeList) ? themeList.slice(0, 6) : []);
      } catch (error) {
        console.error("Failed to fetch themes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchThemes();
  }, []);

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Choose from <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Professional Themes
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover beautiful, responsive themes created by expert developers. 
            Each theme is optimized for performance and user experience.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {themes.map((theme) => (
              <Link
                key={theme.id}
                href={`/theme/details?id=${theme.id}`}
                className="group bg-gradient-card border border-border rounded-xl overflow-hidden shadow-elegant hover:shadow-glow transition-all duration-300 cursor-pointer"
              >
                <div className="aspect-video overflow-hidden relative bg-surface flex items-center justify-center">
                  <Palette className="h-12 w-12 text-muted-foreground/20" />
                </div>
                
                <div className="p-6">
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {theme.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {theme.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{theme.usageCount || 0}</span>
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-primary">
                      {theme.price === 0 || theme.price === undefined ? 'Free' : `$${theme.price}`}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/themes">
              See More Themes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ThemesSection;
