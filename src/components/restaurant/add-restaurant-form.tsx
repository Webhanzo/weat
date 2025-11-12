"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { addRestaurant } from "@/lib/actions";
import type { Dish } from "@/lib/types";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { PlusCircle, Trash2, BookMarked, Image as ImageIcon,DollarSign, Utensils, Tag } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


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

type CurrentMenuItem = Omit<Dish, 'id' | 'price'> & { price: string };

export default function AddRestaurantForm() {
  const [state, formAction] = useActionState(addRestaurant, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const [menuItems, setMenuItems] = useState<Dish[]>([]);
  const [currentMenuItem, setCurrentMenuItem] = useState<CurrentMenuItem>({ name: '', description: '', price: '', category: '' });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);


  useEffect(() => {
    if (state?.message && state.type === 'error') {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast]);

  const handleAddMenuItem = () => {
    const priceNumber = parseFloat(currentMenuItem.price);
    if (currentMenuItem.name && !isNaN(priceNumber) && priceNumber > 0 && currentMenuItem.category) {
      const newItem: Dish = {
        id: `new-${Date.now()}-${Math.random()}`,
        name: currentMenuItem.name,
        description: currentMenuItem.description || '',
        price: priceNumber,
        category: currentMenuItem.category
      };
      setMenuItems([...menuItems, newItem]);
      setCurrentMenuItem({ name: '', description: '', price: '', category: '' }); // Reset the form
    } else {
        toast({
            title: 'Missing dish details',
            description: 'Please provide a valid name, category, and a positive price for the menu item.',
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
          Please provide the restaurant's information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center"><Utensils className="h-4 w-4 mr-2" />Restaurant Name</Label>
            <Input id="name" name="name" placeholder="e.g., The Good Food Place" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center"><BookMarked className="h-4 w-4 mr-2" />Description</Label>
            <Textarea id="description" name="description" placeholder="e.g., Serving the best burgers in town." required />
          </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="image" className="flex items-center"><ImageIcon className="h-4 w-4 mr-2" />Image URL</Label>
              <Input id="image" name="image" placeholder="e.g., https://picsum.photos/seed/restaurant/600/400" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryFee" className="flex items-center"><DollarSign className="h-4 w-4 mr-2" />Delivery Fee</Label>
              <Input id="deliveryFee" name="deliveryFee" type="number" step="0.01" placeholder="e.g., 5.00" required />
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
                          id={`cat-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => handleCategoryChange(category)}
                        />
                      <Label htmlFor={`cat-${category}`} className="font-normal flex-1 cursor-pointer">{category}</Label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
             <input type="hidden" name="category" value={JSON.stringify(selectedCategories)} />
          </div>


          {/* Hidden input to pass menu items to server action */}
          <input type="hidden" name="menu" value={JSON.stringify(menuItems)} />

          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="font-headline text-lg">Menu Items</h3>
            {menuItems.length > 0 && (
                <div className="space-y-2">
                    {menuItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                           <div>
                             <p className="font-semibold">{item.name} - ${item.price.toFixed(2)}</p>
                             <p className="text-sm text-muted-foreground">{item.description}</p>
                           </div>
                            <Button variant="ghost" size="icon" type="button" onClick={() => handleRemoveMenuItem(item.id!)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
            <div className="p-4 border border-dashed rounded-lg space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="menuItemName">Dish Name</Label>
                    <Input id="menuItemName" value={currentMenuItem.name} onChange={(e) => setCurrentMenuItem({...currentMenuItem, name: e.target.value})} placeholder="e.g., Classic Burger" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="menuItemDescription">Dish Description</Label>
                    <Input id="menuItemDescription" value={currentMenuItem.description} onChange={(e) => setCurrentMenuItem({...currentMenuItem, description: e.target.value})} placeholder="e.g., A juicy beef patty..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="menuItemPrice">Dish Price</Label>
                      <Input id="menuItemPrice" type="number" value={currentMenuItem.price} onChange={(e) => setCurrentMenuItem({...currentMenuItem, price: e.target.value})} placeholder="e.g., 12.50" />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="menuItemCategory">Dish Category</Label>
                      <Select 
                        value={currentMenuItem.category} 
                        onValueChange={(value) => setCurrentMenuItem({...currentMenuItem, category: value})}
                        disabled={selectedCategories.length === 0}
                      >
                        <SelectTrigger id="menuItemCategory">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedCategories.length > 0 ? (
                            selectedCategories.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))
                          ) : (
                            <SelectItem value="" disabled>First select restaurant categories</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                  </div>
                </div>
                <Button type="button" variant="outline" onClick={handleAddMenuItem} className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Menu Item
                </Button>
            </div>
          </div>

          <SubmitButton className="w-full font-bold">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Restaurant
          </SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
