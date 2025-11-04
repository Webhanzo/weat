import { notFound } from "next/navigation";
import Link from "next/link";
import { getGroupOrderById } from "@/lib/database";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AddToOrderForm from "@/components/order/add-to-order-form";
import OrderSummary from "@/components/order/order-summary";
import { Button } from "@/components/ui/button";
import { Utensils, User, Clock, Pencil, CheckCircle, Info } from "lucide-react";
import { format } from 'date-fns';
import FinalizeOrderButton from "@/components/order/finalize-order-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function OrderPage({ params }: { params: { id: string } }) {
  const order = await getGroupOrderById(params.id);

  if (!order) {
    notFound();
  }

  const participants = order.participants || [];
  const totalItems = participants.reduce((acc, p) => acc + p.items.reduce((itemAcc, item) => itemAcc + item.quantity, 0), 0);
  const isFinalized = order.status === 'finalized';

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="overflow-hidden shadow-lg rounded-2xl">
            <CardHeader className="bg-muted/50 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="font-headline text-4xl">{order.restaurant.name}</CardTitle>
                  <CardDescription className="flex items-center pt-2 text-base">
                    <Clock className="h-4 w-4 mr-2" />
                    Order created on {format(new Date(order.createdAt), "PPP 'at' p")}
                  </CardDescription>
                </div>
                <Button asChild variant="outline" size="icon">
                  <Link href={`/restaurants/${order.restaurant.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit Restaurant</span>
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 text-muted-foreground mb-6">
                    <div className="flex items-center">
                        <User className="h-5 w-5 mr-3 text-primary"/>
                        <span className="font-semibold">{participants.length} Participants</span>
                    </div>
                    <div className="flex items-center">
                        <Utensils className="h-5 w-5 mr-3 text-primary"/>
                        <span className="font-semibold">{totalItems} Items Ordered</span>
                    </div>
                </div>

              <h3 className="font-headline text-2xl mb-4 border-b pb-2">Who's Ordered What?</h3>
              {participants.length > 0 ? (
                <ul className="space-y-4">
                  {participants.map(participant => (
                    <li key={participant.id} className="p-4 bg-background rounded-lg border">
                      <p className="font-bold text-lg text-primary">{participant.name}</p>
                      <ul className="mt-2 space-y-1 text-sm pl-4 list-disc list-inside">
                        {participant.items.map((item, index) => (
                          <li key={index} className="flex justify-between">
                            <span>{item.quantity}x {item.dish.name}</span>
                            <span className="font-mono">${(item.dish.price * item.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-muted-foreground rounded-lg border border-dashed">
                  <p>No one has added anything to the order yet. Be the first!</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {isFinalized ? (
            <Alert variant="default" className="border-green-500 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-600 dark:text-green-400">Order Finalized</AlertTitle>
              <AlertDescription>
                This order is complete and can no longer be modified.
              </AlertDescription>
            </Alert>
          ) : (
            <AddToOrderForm order={order} />
          )}

        </div>
        <div className="lg:col-span-1 space-y-6">
          <OrderSummary order={order} />
          {!isFinalized && (
            <Card>
              <CardHeader>
                <CardTitle>Finalize Order</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Once finalized, no more items can be added to this order. It will be moved to your order history.
                </p>
                <FinalizeOrderButton orderId={order.id} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
