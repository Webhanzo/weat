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
import { PlusCircle, Trash2, BookMarked, Image as ImageIcon, DollarSign, Utensils, Save, Tag, Pencil, X, Check, Phone, Flame } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import DeleteRestaurantButton from "./delete-restaurant-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialState = {
  message: "",
  type: "",
};

const initialCategories = [
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

type CurrentMenuItem = Omit<Dish, 'id'|'price'|'category'|'hasSpicyOption'> & {id?:string, price:string, category:string | undefined, hasSpicyOption: boolean }

export default function EditRestaurantForm({ restaurant }: EditRestaurantFormProps) {
  const [state, formAction] = useActionState(updateRestaurant, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const [menuItems, setMenuItems] = useState<Dish[]>(restaurant.menu || []);
  const [currentMenuItem, setCurrentMenuItem] = useState<CurrentMenuItem>({ name: '', description: '', price: '', category: undefined, hasSpicyOption: false });
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const allInitialCategories = Array.from(new Set([...initialCategories, ...(Array.isArray(restaurant.category) ? restaurant.category : [restaurant.category].filter(Boolean) as string[])]));
  const [categories, setCategories] = useState<string[]>(allInitialCategories);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(Array.isArray(restaurant.category) ? restaurant.category : [restaurant.category].filter(Boolean) as string[]);
  
  const [editingCategory, setEditingCategory] = useState<{ oldName: string; newName: string } | null>(null);


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

  const resetDishForm = () => {
    setCurrentMenuItem({ name: '', description: '', price: '', category: undefined, hasSpicyOption: false });
    setIsEditing(null);
  }

  const handleAddOrUpdateMenuItem = () => {
    const priceNumber = parseFloat(currentMenuItem.price);
    if (currentMenuItem.name && !isNaN(priceNumber) && priceNumber > 0 && currentMenuItem.category) {
      if(isEditing) {
        // Update existing item
        setMenuItems(menuItems.map(item => 
          item.id === isEditing
            ? { ...item, name: currentMenuItem.name, description: currentMenuItem.description || '', price: priceNumber, category: currentMenuItem.category || '', hasSpicyOption: currentMenuItem.hasSpicyOption }
            : item
        ));
        toast({ title: 'Dish Updated', description: `${currentMenuItem.name} has been updated.`});
      } else {
        // Add new item
        const newItem: Dish = {
          id: `new-${Date.now()}-${Math.random()}`,
          name: currentMenuItem.name,
          description: currentMenuItem.description || '',
          price: priceNumber,
          category: currentMenuItem.category || '',
          hasSpicyOption: currentMenuItem.hasSpicyOption,
        };
        setMenuItems([...menuItems, newItem]);
        toast({ title: 'Dish Added', description: `${newItem.name} has been added to the menu.`});
      }
      resetDishForm();
    } else {
      toast({
        title: 'Missing dish details',
        description: 'Please provide a valid name, category, and a positive price for the menu item.',
        variant: 'destructive',
      });
    }
  };

  const handleEditClick = (dish: Dish) => {
      setIsEditing(dish.id);
      setCurrentMenuItem({
        name: dish.name,
        description: dish.description || '',
        price: dish.price.toString(),
        category: dish.category,
        hasSpicyOption: dish.hasSpicyOption || false,
      });
  }

  const handleRemoveMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
     if(isEditing && isEditing === id) {
        resetDishForm();
    }
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  }

  const handleAddNewCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
        setCategories(prev => [...prev, newCategory].sort());
        setSelectedCategories(prev => [...prev, newCategory]);
        setNewCategory("");
    }
  }

  const handleStartEditingCategory = (category: string) => {
    setEditingCategory({ oldName: category, newName: category });
  };
  
  const handleCancelEditingCategory = () => {
    setEditingCategory(null);
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !editingCategory.newName.trim() || editingCategory.newName === editingCategory.oldName) {
      setEditingCategory(null);
      return;
    }

    setCategories(prev =>
      prev.map(c => (c === editingCategory.oldName ? editingCategory.newName : c)).sort()
    );

    setSelectedCategories(prev =>
      prev.map(c => (c === editingCategory.oldName ? editingCategory.newName : c))
    );
    
    setMenuItems(prev => 
      prev.map(item => item.category === editingCategory.oldName ? {...item, category: editingCategory.newName} : item)
    );
    
    if(currentMenuItem.category === editingCategory.oldName) {
      setCurrentMenuItem(prev => ({...prev, category: editingCategory.newName}));
    }

    setEditingCategory(null);
  };
  
  const handleDeleteCategory = (categoryToDelete: string) => {
      setCategories(prev => prev.filter(c => c !== categoryToDelete));
      setSelectedCategories(prev => prev.filter(c => c !== categoryToDelete));
      // Optional: decide what to do with dishes that had this category
      setMenuItems(prev => prev.filter(item => item.category !== categoryToDelete));
      if(currentMenuItem.category === categoryToDelete) {
        setCurrentMenuItem(prev => ({...prev, category: undefined}));
      }
      toast({
        title: "Category Deleted",
        description: `Category "${categoryToDelete}" and its associated dishes have been removed.`,
        variant: "destructive"
      })
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
                <Label htmlFor="phoneNumber" className="flex items-center"><Phone className="h-4 w-4 mr-2" />Phone Number</Label>
                <Input id="phoneNumber" name="phoneNumber" type="tel" defaultValue={restaurant.phoneNumber} placeholder="e.g., 0791234567" />
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
                    <div key={category} className="flex items-center justify-between space-x-2 p-1 rounded-md hover:bg-muted/50">
                       {editingCategory?.oldName === category ? (
                         <div className="flex items-center gap-1 w-full">
                           <Input 
                              value={editingCategory.newName}
                              onChange={(e) => setEditingCategory({...editingCategory, newName: e.target.value})}
                              className="h-8"
                              autoFocus
                              onKeyDown={(e) => e.key === 'Enter' && handleUpdateCategory()}
                           />
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" onClick={handleUpdateCategory}><Check className="h-4 w-4"/></Button>
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={handleCancelEditingCategory}><X className="h-4 w-4"/></Button>
                         </div>
                       ) : (
                         <>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`cat-edit-${category}`}
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={() => handleCategoryChange(category)}
                              />
                              <Label htmlFor={`cat-edit-${category}`} className="font-normal flex-1 cursor-pointer">{category}</Label>
                            </div>
                           <div className="flex items-center">
                               <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleStartEditingCategory(category)}>
                                   <Pencil className="h-3 w-3" />
                               </Button>
                               <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteCategory(category)}>
                                   <Trash2 className="h-3 w-3" />
                               </Button>
                           </div>
                         </>
                       )}
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t space-y-2">
                    <div className="flex gap-2">
                        <Input 
                            placeholder="Add new category..." 
                            value={newCategory} 
                            onChange={(e) => setNewCategory(e.target.value)} 
                        />
                        <Button type="button" onClick={handleAddNewCategory}>Add</Button>
                    </div>
                </div>
              </PopoverContent>
            </Popover>
            <input type="hidden" name="category" value={JSON.stringify(selectedCategories)} />
          </div>

          <input type="hidden" name="menu" value={JSON.stringify(menuItems)} />

          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="font-headline text-lg">{isEditing ? 'Edit Menu Item' : 'Add Menu Item'}</h3>
            {menuItems.length > 0 && (
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md gap-2">
                    <div>
                      <p className="font-semibold">{item.name} - ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price} {item.hasSpicyOption && <Flame className="inline h-4 w-4 ml-1 text-red-500" />}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" type="button" onClick={() => handleEditClick(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" type="button" onClick={() => handleRemoveMenuItem(item.id!)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="p-4 border border-dashed rounded-lg space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="menuItemName">Dish Name</Label>
                  <Input id="menuItemName" value={currentMenuItem.name} onChange={(e) => setCurrentMenuItem({ ...currentMenuItem, name: e.target.value })} placeholder="e.g., Classic Burger" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="menuItemDescription">Dish Description</Label>
                  <Input id="menuItemDescription" value={currentMenuItem.description} onChange={(e) => setCurrentMenuItem({ ...currentMenuItem, description: e.target.value })} placeholder="e.g., A juicy beef patty..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="menuItemPrice">Dish Price</Label>
                    <Input id="menuItemPrice" type="number" value={currentMenuItem.price} onChange={(e) => setCurrentMenuItem({ ...currentMenuItem, price: e.target.value })} placeholder="e.g., 12.50" />
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
                            <SelectItem value="placeholder" disabled>First select restaurant categories</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="editHasSpicyOption"
                        checked={currentMenuItem.hasSpicyOption}
                        onCheckedChange={(checked) => setCurrentMenuItem({ ...currentMenuItem, hasSpicyOption: !!checked })}
                    />
                    <Label htmlFor="editHasSpicyOption" className="flex items-center gap-2">Offer a spicy version of this dish <Flame className="h-4 w-4" /></Label>
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={handleAddOrUpdateMenuItem} className="w-full">
                        {isEditing ? <><Save className="mr-2 h-4 w-4" /> Update Item</> : <><PlusCircle className="mr-2 h-4 w-4" /> Add Item</>}
                    </Button>
                    {isEditing && (
                        <Button type="button" variant="ghost" size="icon" onClick={resetDishForm}>
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <SubmitButton className="w-full font-bold">
              <Save className="mr-2 h-4 w-4" />
              Save Changes to Restaurant
            </SubmitButton>
            <DeleteRestaurantButton restaurantId={restaurant.id} />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
