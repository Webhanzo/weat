import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background/95">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <UtensilsCrossed className="h-6 w-6 text-primary" />
          <p className="text-center text-sm leading-loose md:text-left">
            Built by your friends at Firebase.
          </p>
        </div>
        <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} WeEat. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
