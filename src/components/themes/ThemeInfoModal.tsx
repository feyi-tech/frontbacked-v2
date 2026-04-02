import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { themesApi } from '@/api/themes';
import { Theme } from '@/types/api';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, User as UserIcon, Heart } from 'lucide-react';
import Link from 'next/link';
import { ThemeReviews } from './ThemeReviews';

interface ThemeInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  themeId: string;
}

export const ThemeInfoModal = ({ open, onOpenChange, themeId }: ThemeInfoModalProps) => {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && themeId) {
      setLoading(true);
      themesApi.get(themeId)
        .then(setTheme)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [open, themeId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : theme && (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl">{theme.name}</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-video bg-surface rounded-lg flex items-center justify-center">
                    {/* Theme Preview Placeholder */}
                    <span className="text-muted-foreground">Preview Image</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Heart className="h-5 w-5 text-red-500 fill-current" />
                        <span className="font-bold">{theme.likes || 0} Likes</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {theme.usageCount || 0} Sites using this theme
                    </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm uppercase text-muted-foreground mb-1">Description</h4>
                  <p className="text-foreground">{theme.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm uppercase text-muted-foreground mb-2">Creator</h4>
                  <Link href={`/profile?id=${theme.author?.id}`} className="flex items-center space-x-3 group">
                    <Avatar className="h-10 w-10 border border-border group-hover:border-primary transition-colors">
                      <AvatarImage src={theme.author?.photo} />
                      <AvatarFallback>
                        <UserIcon className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium group-hover:text-primary transition-colors">{theme.author?.name || 'Anonymous'}</p>
                      <p className="text-xs text-muted-foreground">View Profile</p>
                    </div>
                  </Link>
                </div>

                {theme.pricing && (
                    <div className="pt-4 border-t border-border">
                        <h4 className="font-semibold text-sm uppercase text-muted-foreground mb-2">Pricing</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="p-2 bg-surface rounded">Monthly: ${theme.pricing.monthly}</div>
                            <div className="p-2 bg-surface rounded">Yearly: ${theme.pricing.yearly}</div>
                            <div className="p-2 bg-primary/10 text-primary font-bold rounded col-span-2 text-center">
                                Lifetime: ${theme.pricing.purchase}
                            </div>
                        </div>
                    </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-border">
                <h3 className="text-xl font-bold mb-4">Reviews</h3>
                <ThemeReviews themeId={themeId} totalLikes={theme.likes || 0} />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
