import { Button } from "@/components/ui/button";
import { Lightbulb, PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { findOrderByCode } from "@/lib/actions";
import { SubmitButton } from "@/components/ui/submit-button";

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/10">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary">
                    WeEat: Order Together, Eat Together
                  </h1>
                  <p className="max-w-[600px] text-foreground/80 md:text-xl">
                    Tired of chasing colleagues for their lunch orders? WeEat simplifies group food ordering. Start an order, share the link, and watch the orders roll in.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="font-bold">
                    <Link href="/orders/create">
                      <PlusCircle className="mr-2 h-5 w-5" /> Start a New Order
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="font-bold border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                    <Link href="/suggestions">
                      <Lightbulb className="mr-2 h-5 w-5" /> Get Suggestions
                    </Link>
                  </Button>
                </div>
              </div>
               <div className="flex flex-col items-center justify-center space-y-6 rounded-lg bg-card p-8 shadow-lg">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold font-headline">Find an Order</h3>
                    <p className="text-muted-foreground">Enter the 6-digit code to join an existing order.</p>
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
        </section>
      </main>
    </div>
  );
}
