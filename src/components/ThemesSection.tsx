import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Star, Users, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const ThemesSection = () => {
  const [hoveredTheme, setHoveredTheme] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});

  const themes = [
    {
      id: 1,
      name: "Modern Business",
      description: "Clean and professional design perfect for corporate websites",
      users: 1234,
      rating: 4.8,
      images: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop"
      ]
    },
    {
      id: 2,
      name: "Creative Portfolio",
      description: "Artistic and dynamic layout for creatives and designers",
      users: 856,
      rating: 4.9,
      images: [
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=300&fit=crop"
      ]
    },
    {
      id: 3,
      name: "E-commerce Pro",
      description: "Optimized for online stores with built-in payment integration",
      users: 2103,
      rating: 4.7,
      images: [
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1556742400-b5392798c4f4?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=400&h=300&fit=crop"
      ]
    },
    {
      id: 4,
      name: "Restaurant Delux",
      description: "Appetizing design for restaurants and food businesses",
      users: 674,
      rating: 4.6,
      images: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=400&h=300&fit=crop"
      ]
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (hoveredTheme !== null) {
      interval = setInterval(() => {
        setCurrentImageIndex(prev => ({
          ...prev,
          [hoveredTheme]: ((prev[hoveredTheme] || 0) + 1) % themes[hoveredTheme - 1].images.length
        }));
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [hoveredTheme, themes]);

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className="group bg-gradient-card border border-border rounded-xl overflow-hidden shadow-elegant hover:shadow-glow transition-all duration-300 cursor-pointer"
              onMouseEnter={() => {
                setHoveredTheme(theme.id);
                setCurrentImageIndex(prev => ({ ...prev, [theme.id]: 0 }));
              }}
              onMouseLeave={() => setHoveredTheme(null)}
            >
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={theme.images[currentImageIndex[theme.id] || 0]}
                  alt={theme.name}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />
                {hoveredTheme === theme.id && theme.images.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    {theme.images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === (currentImageIndex[theme.id] || 0)
                            ? 'bg-primary'
                            : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {theme.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {theme.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-foreground font-medium">{theme.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{theme.users.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

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