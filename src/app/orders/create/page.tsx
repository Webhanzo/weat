import { getRestaurants } from "@/lib/database";
import RestaurantCard from "@/components/order/restaurant-card";

export default async function CreateOrderPage() {
  const restaurants = await getRestaurants();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Start a New Order</h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-2">Choose a restaurant to get started.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {restaurants.map(restaurant => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
}
