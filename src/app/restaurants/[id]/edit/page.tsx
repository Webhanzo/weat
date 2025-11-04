import { getRestaurantById } from "@/lib/database";
import EditRestaurantForm from "@/components/restaurant/edit-restaurant-form";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";

export default async function EditRestaurantPage({ params }: { params: { id: string } }) {
  const restaurant = await getRestaurantById(params.id);

  if (!restaurant) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
      <div className="text-center mb-8">
        <Pencil className="mx-auto h-12 w-12 text-accent" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mt-4">
          Edit Restaurant
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-2">
          Update the details for "{restaurant.name}".
        </p>
      </div>
      <EditRestaurantForm restaurant={restaurant} />
    </div>
  );
}
