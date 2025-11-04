import AddRestaurantForm from "@/components/restaurant/add-restaurant-form";
import { Utensils } from "lucide-react";

export default function AddRestaurantPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
      <div className="text-center mb-8">
        <Utensils className="mx-auto h-12 w-12 text-accent" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mt-4">
          Add a New Restaurant
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-2">
          Fill in the details below to add a new restaurant to our database.
        </p>
      </div>
      <AddRestaurantForm />
    </div>
  );
}
