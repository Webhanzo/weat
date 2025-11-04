import { getRestaurants } from "@/lib/database";
import RestaurantCard from "@/components/order/restaurant-card";
import type { Restaurant } from "@/lib/types";

export default async function CreateOrderPage() {
  const restaurants = await getRestaurants();

  const groupedRestaurants = restaurants.reduce((acc, restaurant) => {
    if (Array.isArray(restaurant.category)) {
      if (restaurant.category.length > 1) {
        if (!acc['متنوع']) {
          acc['متنوع'] = [];
        }
        acc['متنوع'].push(restaurant);
      } else if (restaurant.category.length === 1) {
        const category = restaurant.category[0];
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(restaurant);
      }
    }
    // For older data that might still have category as a string
    else if (typeof restaurant.category === 'string') {
        const category = restaurant.category || "Uncategorized";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(restaurant);
    }

    return acc;
  }, {} as Record<string, Restaurant[]>);

  const categories = Object.keys(groupedRestaurants).sort((a,b) => {
    if (a === 'متنوع') return 1;
    if (b === 'متنوع') return -1;
    return a.localeCompare(b);
  });


  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Start a New Order</h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-2">Choose a restaurant to get started.</p>
      </div>

      <div className="space-y-12">
        {categories.map(category => (
          <div key={category}>
            <h2 className="text-3xl font-bold font-headline text-accent mb-6 border-b-2 border-accent pb-2">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {groupedRestaurants[category].map(restaurant => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
