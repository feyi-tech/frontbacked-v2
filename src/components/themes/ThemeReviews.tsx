import React, { useState, useEffect, useRef, useCallback } from 'react';
import { themesApi } from '@/api/themes';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Loader2, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';

interface Review {
    id: string;
    userId: string;
    userName: string;
    userPhoto?: string;
    content: string;
    likes: number;
    dislikes: number;
    createdAt: string;
}

interface ThemeReviewsProps {
    themeId: string;
    totalLikes: number;
}

export const ThemeReviews = ({ themeId, totalLikes }: ThemeReviewsProps) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observer = useRef<IntersectionObserver>();

    const fetchReviews = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const data = await themesApi.getReviews(themeId, page);
            if (data.reviews.length < 20) setHasMore(false);
            setReviews(prev => [...prev, ...data.reviews]);
            setPage(prev => prev + 1);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [themeId, page, loading, hasMore]);

    useEffect(() => {
        fetchReviews();
    }, []);

    const lastReviewRef = useCallback((node: HTMLDivElement) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                fetchReviews();
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore, fetchReviews]);

    const handleLike = async (reviewId: string) => {
        if (!user) return toast.error("Please login to like reviews");
        // The backend should handle the verification of whether the user has used the theme.
        try {
            await themesApi.likeReview(reviewId);
            setReviews(prev => prev.map(r =>
                r.id === reviewId ? { ...r, likes: r.likes + 1 } : r
            ));
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDislike = async (reviewId: string) => {
        if (!user) return toast.error("Please login to dislike reviews");
        try {
            await themesApi.dislikeReview(reviewId);
            setReviews(prev => prev.map(r =>
                r.id === reviewId ? { ...r, dislikes: r.dislikes + 1 } : r
            ));
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-surface p-4 rounded-lg border border-border">
                <span className="font-semibold text-lg">Total Theme Likes</span>
                <span className="text-2xl font-bold text-primary">{totalLikes}</span>
            </div>

            <div className="space-y-4">
                {reviews.map((review, index) => (
                    <div
                        key={review.id}
                        ref={index === reviews.length - 1 ? lastReviewRef : null}
                        className="p-4 border border-border rounded-lg space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={review.userPhoto} />
                                    <AvatarFallback><UserIcon className="h-4 w-4" /></AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">{review.userName}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 space-x-1"
                                    onClick={() => handleLike(review.id)}
                                >
                                    <ThumbsUp className="h-4 w-4" />
                                    <span className="text-xs">{review.likes}</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 space-x-1"
                                    onClick={() => handleDislike(review.id)}
                                >
                                    <ThumbsDown className="h-4 w-4" />
                                    <span className="text-xs">{review.dislikes}</span>
                                </Button>
                            </div>
                        </div>
                        <p className="text-sm text-foreground">{review.content}</p>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                )}

                {!loading && reviews.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No reviews yet.</p>
                )}
            </div>
        </div>
    );
};
