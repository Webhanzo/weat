'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type RatingInputProps = {
    name: string;
    defaultValue?: number;
};

export default function RatingInput({ name, defaultValue = 0 }: RatingInputProps) {
    const [rating, setRating] = useState(defaultValue);
    const [hover, setHover] = useState(0);

    return (
        <div className="flex items-center space-x-1">
            <input type="hidden" name={name} value={rating} />
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <button
                        type="button"
                        key={ratingValue}
                        onClick={() => setRating(ratingValue)}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(0)}
                        className="focus:outline-none"
                    >
                        <Star
                            className={cn(
                                "h-6 w-6 cursor-pointer transition-colors",
                                ratingValue <= (hover || rating)
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-muted-foreground"
                            )}
                        />
                    </button>
                );
            })}
        </div>
    );
}