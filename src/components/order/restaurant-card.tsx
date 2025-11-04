import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Restaurant } from "@/lib/types";
import { createOrder } from "@/lib/actions";
import { Utensils, CircleDollarSign } from "lucide-react";
import { SubmitButton } from "../ui/submit-button";

type RestaurantCardProps = {
  restaurant: Restaurant;
};

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-2xl rounded-2xl">
      <CardHeader className="p-0">
        <div className="aspect-video relative">
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            fill
            className="object-cover"
            data-ai-hint="restaurant food"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <CardTitle className="font-headline text-2xl mb-2">{restaurant.name}</CardTitle>
        <CardDescription>{restaurant.description}</CardDescription>
        <div className="mt-4 flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
                <CircleDollarSign className="h-4 w-4 mr-1.5" />
                Delivery: ${restaurant.deliveryFee.toFixed(2)}
            </div>
             <div className="flex items-center">
                <Utensils className="h-4 w-4 mr-1.5" />
                {restaurant.menu?.length || 0} menu items
            </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 bg-muted/50">
        <form action={createOrder} className="w-full">
          <input type="hidden" name="restaurantId" value={restaurant.id} />
          <SubmitButton className="w-full font-bold">
            Start Group Order
          </SubmitButton>
        </form>
      </CardFooter>
    </Card>
  );
}
