import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type RatingDisplayProps = {
    rating?: number;
    ratingCount?: number;
    className?: string;
};

export default function RatingDisplay({ rating, ratingCount, className }: RatingDisplayProps) {
    if (!rating || !ratingCount) {
        return (
            <div className={cn("flex items-center gap-1 text-sm text-muted-foreground", className)}>
                <Star className="h-4 w-4" />
                <span>No ratings yet</span>
            </div>
        );
    }
    
    const roundedRating = Math.round(rating * 10) / 10;

    return (
        <div className={cn("flex items-center gap-1 text-sm", className)}>
            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
            <span className="font-bold">{roundedRating.toFixed(1)}</span>
            <span className="text-muted-foreground">({ratingCount})</span>
        </div>
    );
}