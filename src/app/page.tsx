import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { getGroupOrders } from "@/lib/database";
import { PlusCircle, Lightbulb, ArrowRight, Users, Utensils, Clock, Search } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from 'date-fns';
import { Input } from "@/components/ui/input";
import { findOrderByCode } from "@/lib/actions";
import { SubmitButton } from "@/components/ui/submit-button";

export default async function Home() {
  const allOrders = await getGroupOrders();
  const activeOrders = allOrders.filter(order => order.status === 'active');

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
        
        <section id="active-orders" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Active Group Orders</h2>
                <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Jump into an existing order or start your own!
                </p>
              </div>
            </div>
            {activeOrders.length > 0 ? (
              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
                {activeOrders.map(order => {
                    const participantCount = order.participants?.length || 0;
                    const totalItems = order.participants?.reduce((acc, p) => acc + p.items.reduce((itemAcc, item) => itemAcc + item.quantity, 0), 0) || 0;

                    return (
                        <Card key={order.id} className="flex flex-col transition-transform transform hover:-translate-y-1 hover:shadow-xl bg-card border-border/50 shadow-lg rounded-xl">
                            <CardHeader>
                            <CardTitle className="font-headline text-2xl">{order.restaurant.name}</CardTitle>
                            <CardDescription className="flex items-center pt-1">
                                <Clock className="h-4 w-4 mr-1.5" />
                                Started {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                            </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>{participantCount} participant{participantCount === 1 ? '' : 's'}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
                                <Utensils className="h-4 w-4" />
                                <span>{totalItems} item{totalItems === 1 ? '' : 's'} ordered</span>
                            </div>
                            </CardContent>
                            <CardFooter>
                            <Button asChild className="w-full font-bold bg-accent text-accent-foreground hover:bg-accent/90">
                                <Link href={`/orders/${order.id}`}>
                                Join Order <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
              </div>
            ) : (
               <div className="text-center py-12 text-foreground/60">
                <p>No active orders right now. Why not start one?</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
