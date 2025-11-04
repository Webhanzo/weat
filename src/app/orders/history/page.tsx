import { getHistoryOrders } from "@/lib/database";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, ArrowRight, Users, Utensils, Clock, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { format } from 'date-fns';

export default async function OrderHistoryPage() {
  const historyOrders = await getHistoryOrders();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <History className="mx-auto h-16 w-16 text-accent" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mt-4">Order History</h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-2">A record of all your past group orders.</p>
      </div>

      {historyOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {historyOrders.map(order => {
             const participantCount = order.participants?.length || 0;
             const totalItems = order.participants?.reduce((acc, p) => acc + p.items.reduce((itemAcc, item) => itemAcc + item.quantity, 0), 0) || 0;
             const grandTotal = order.participants?.reduce((acc, p) => acc + p.items.reduce((itemAcc, item) => itemAcc + (item.dish.price * item.quantity), 0), 0) + order.restaurant.deliveryFee;

            return (
              <Card key={order.id} className="flex flex-col shadow-lg rounded-xl border-border/50">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">{order.restaurant.name}</CardTitle>
                  <CardDescription className="flex items-center pt-1">
                    <Clock className="h-4 w-4 mr-1.5" />
                    Ordered on {format(new Date(order.createdAt), "PPP")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                   <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{participantCount} participant{participantCount === 1 ? '' : 's'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Utensils className="h-4 w-4" />
                        <span>{totalItems} item{totalItems === 1 ? '' : 's'}</span>
                    </div>
                     <div className="flex items-center space-x-2 text-sm font-bold text-primary">
                        <ShoppingCart className="h-4 w-4" />
                        <span>Total: ${grandTotal.toFixed(2)}</span>
                    </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full font-bold" variant="outline">
                    <Link href={`/orders/${order.id}`}>
                      View Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
           <History className="mx-auto h-12 w-12 mb-4" />
          <h3 className="text-xl font-semibold">No Past Orders Found</h3>
          <p>Your archived group orders will appear here.</p>
        </div>
      )}
    </div>
  );
}
