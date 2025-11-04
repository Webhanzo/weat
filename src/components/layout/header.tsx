import { UtensilsCrossed, History } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <UtensilsCrossed className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">WeEat</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center space-x-2">
                 <Button asChild variant="ghost">
                    <Link href="/">Home</Link>
                </Button>
                <Button asChild variant="ghost">
                    <Link href="/orders/create">انشاء طلب</Link>
                </Button>
                <Button asChild variant="ghost">
                    <Link href="/orders/history">History</Link>
                </Button>
                <Button asChild variant="ghost">
                    <Link href="/suggestions">Suggestions</Link>
                </Button>
                <Button asChild variant="ghost">
                    <Link href="/restaurants/add">Add Restaurant</Link>
                </Button>
            </nav>
        </div>
      </div>
    </header>
  );
}
