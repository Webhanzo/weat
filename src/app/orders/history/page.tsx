import { History, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { findOrderByCode } from "@/lib/actions";
import { SubmitButton } from "@/components/ui/submit-button";

export default function OrderHistoryPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
      <div className="text-center mb-12 max-w-2xl">
        <History className="mx-auto h-16 w-16 text-accent" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mt-4">Find a Past Order</h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-2">
          Enter the 6-digit code of a past order to view its details.
        </p>
      </div>

      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center justify-center space-y-6 rounded-lg bg-card p-8 shadow-lg">
          <div className="text-center">
            <h3 className="text-2xl font-bold font-headline">Find an Order</h3>
            <p className="text-muted-foreground">Enter the 6-digit code to find a past order.</p>
          </div>
          <form action={findOrderByCode} className="w-full max-w-sm space-y-2">
            <Input name="orderCode" placeholder="e.g., AB12CD" className="text-center tracking-widest font-mono uppercase" maxLength={6} />
            <SubmitButton className="w-full font-bold">
              <Search className="mr-2 h-4 w-4" /> Find Order
            </SubmitButton>
          </form>
        </div>
      </div>
    </div>
  );
}
