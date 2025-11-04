"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { updateRestaurant } from "@/lib/actions";
import type { Dish, Restaurant } from "@/lib/types";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { PlusCircle, Trash2, BookMarked, Image as ImageIcon, DollarSign, Utensils, Save, Tag } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

const initialState = {
  message: "",
  type: "",
};

const categories = [
  "Shawerma",
  "Broasted",
  "Snacks",
  "Zinger",
  "Wings",
  "Calazone",
  "Grill",
  "Burger",
  "Pizza",
  "Sweets",
  "Mansaf",
  "Sea food",
];

type EditRestaurantFormProps = {
  restaurant: Restaurant;
};

export default function EditRestaurantForm({ restaurant }: EditRestaurantFormProps) {
  const [state, formAction] = useActionState(updateRestaurant, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const [menuItems, setMenuItems] = useState<Partial<Dish>[]>(restaurant.menu || []);
  const [currentMenuItem, setCurrentMenuItem] = useState({ name: '', description: '', price: '' });
  const [selectedCategories, setSelectedCategories] = useState<string[]>(Array.isArray(restaurant.category) ? restaurant.category : [restaurant.category].filter(Boolean) as string[]);


  useEffect(() => {
    if (state?.message) {
      if (state.type === 'success') {
        toast({
          title: "Success!",
          description: state.message,
        });
      } else {
        toast({
          title: "Error",
          description: state.message,
          variant: "destructive",
        });
      }
    }
  }, [state, toast]);

  const handleAddMenuItem = () => {
    if (currentMenuItem.name && currentMenuItem.price) {
      setMenuItems([...menuItems, { ...currentMenuItem, id: `new-${Date.now()}` }]);
      setCurrentMenuItem({ name: '', description: '', price: '' });
    } else {
      toast({
        title: 'Missing dish details',
        description: 'Please provide at least a name and price for the menu item.',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  }

  return (
    <Card className="shadow-2xl rounded-2xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Restaurant Details</CardTitle>
        <CardDescription>
          Update the restaurant's information below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          <input type="hidden" name="id" value={restaurant.id} />
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center"><Utensils className="h-4 w-4 mr-2" />Restaurant Name</Label>
            <Input id="name" name="name" defaultValue={restaurant.name} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center"><BookMarked className="h-4 w-4 mr-2" />Description</Label>
            <Textarea id="description" name="description" defaultValue={restaurant.description} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="image" className="flex items-center"><ImageIcon className="h-4 w-4 mr-2" />Image URL</Label>
              <Input id="image" name="image" defaultValue={restaurant.image} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryFee" className="flex items-center"><DollarSign className="h-4 w-4 mr-2" />Delivery Fee</Label>
              <Input id="deliveryFee" name="deliveryFee" type="number" step="0.01" defaultValue={restaurant.deliveryFee} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="flex items-center"><Tag className="h-4 w-4 mr-2" />Category</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start font-normal">
                  {selectedCategories.length > 0 ? selectedCategories.join(', ') : 'Select categories'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <div className="space-y-1 p-2">
                  {categories.map(category => (
                    <div key={category} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                       <Checkbox
                          id={`cat-edit-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => handleCategoryChange(category)}
                        />
                      <Label htmlFor={`cat-edit-${category}`} className="font-normal flex-1 cursor-pointer">{category}</Label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <input type="hidden" name="category" value={JSON.stringify(selectedCategories)} />
          </div>

          <input type="hidden" name="menu" value={JSON.stringify(menuItems)} />

          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="font-headline text-lg">Menu Items</h3>
            {menuItems.length > 0 && (
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                    <div>
                      <p className="font-semibold">{item.name} - ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Button variant="ghost" size="icon" type="button" onClick={() => handleRemoveMenuItem(item.id!)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="menuItemName">Dish Name</Label>
              <Input id="menuItemName" value={currentMenuItem.name} onChange={(e) => setCurrentMenuItem({ ...currentMenuItem, name: e.target.value })} placeholder="e.g., Classic Burger" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="menuItemDescription">Dish Description</Label>
              <Input id="menuItemDescription" value={currentMenuItem.description} onChange={(e) => setCurrentMenuItem({ ...currentMenuItem, description: e.target.value })} placeholder="e.g., A juicy beef patty..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="menuItemPrice">Dish Price</Label>
              <Input id="menuItemPrice" type="number" value={currentMenuItem.price} onChange={(e) => setCurrentMenuItem({ ...currentMenuItem, price: e.target.value })} placeholder="e.g., 12.50" />
            </div>
            <Button type="button" variant="outline" onClick={handleAddMenuItem} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Menu Item
            </Button>
          </div>

          <SubmitButton className="w-full font-bold">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
