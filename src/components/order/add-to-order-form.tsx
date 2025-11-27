'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { addItemToOrder } from '@/lib/actions';
import type { GroupOrder, Dish, OrderItem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SubmitButton } from '@/components/ui/submit-button';
import { PlusCircle, Trash2, Flame } from 'lucide-react';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

type AddToOrderFormProps = {
    order: GroupOrder;
};

const initialState = {
  message: '',
  type: ''
};

// This represents an item being staged before being added to the main order
type StagedOrderItem = {
    id: string; // a temporary unique id for the list key
    dishId: string;
    dishName: string;
    dishPrice: number;
    hasSpicyOption?: boolean;
    quantity: number;
    preference?: 'spicy' | 'regular';
}

export default function AddToOrderForm({ order }: AddToOrderFormProps) {
  const [state, formAction] = useActionState(addItemToOrder, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const [userName, setUserName] = useState('');
  const [stagedItems, setStagedItems] = useState<StagedOrderItem[]>([]);
  const [selectedDishId, setSelectedDishId] = useState<string | undefined>(undefined);

  const handleAddItem = () => {
    if (!selectedDishId) {
        toast({ title: "No dish selected", description: "Please select a dish to add.", variant: "destructive" });
        return;
    }
    const dish = order.restaurant.menu?.find(d => d.id === selectedDishId);
    if (!dish) return;

    const newItem: StagedOrderItem = {
        id: `staged-${Date.now()}`,
        dishId: dish.id,
        dishName: dish.name,
        dishPrice: dish.price,
        hasSpicyOption: dish.hasSpicyOption,
        quantity: 1,
        preference: dish.hasSpicyOption ? 'regular' : undefined,
    };
    setStagedItems([...stagedItems, newItem]);
    setSelectedDishId(undefined); // Reset select
  };
  
  const handleRemoveStagedItem = (id: string) => {
    setStagedItems(stagedItems.filter(item => item.id !== id));
  }

  const handleStagedItemChange = (id: string, field: 'quantity' | 'preference', value: number | 'spicy' | 'regular') => {
      setStagedItems(items => items.map(item => {
          if (item.id === id) {
              if (field === 'quantity' && typeof value === 'number' && value >= 1) {
                  return { ...item, quantity: value };
              }
              if (field === 'preference' && (value === 'spicy' || value === 'regular')) {
                  return { ...item, preference: value };
              }
          }
          return item;
      }));
  };


  useEffect(() => {
    if (state.message) {
      if(state.type === 'success') {
        toast({
            title: 'Success!',
            description: state.message,
        });
        formRef.current?.reset();
        setStagedItems([]);
        setUserName('');
      } else {
         toast({
            title: 'Error',
            description: state.message,
            variant: 'destructive',
        });
      }
    }
  }, [state, toast]);

  return (
    <Card className="shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center">
            <PlusCircle className="h-6 w-6 mr-3 text-primary" />
            Add Your Items
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-6">
          <input type="hidden" name="orderId" value={order.id} />
          <input type="hidden" name="items" value={JSON.stringify(stagedItems.map(({id, dishName, dishPrice, hasSpicyOption, ...rest}) => rest))} />
          
          <div className="space-y-2">
            <Label htmlFor="userName">Your Name</Label>
            <Input id="userName" name="userName" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="e.g., Jane Doe" required />
          </div>
          
           <div className="space-y-4 rounded-lg border p-4">
              <Label>Build Your Order</Label>
               <div className="flex gap-2">
                   <Select value={selectedDishId} onValueChange={setSelectedDishId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a dish to add..." />
                        </SelectTrigger>
                        <SelectContent>
                        {order.restaurant.menu && order.restaurant.menu.map(dish => (
                            <SelectItem key={dish.id} value={dish.id}>
                            {dish.name} - ${dish.price.toFixed(2)}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <Button type="button" onClick={handleAddItem} disabled={!selectedDishId}>Add Dish</Button>
               </div>

                {stagedItems.length > 0 && (
                    <div className="space-y-4 pt-4">
                        {stagedItems.map((item) => (
                            <div key={item.id} className="p-3 bg-muted/50 rounded-lg space-y-3">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold">{item.dishName} <span className="font-mono text-sm text-muted-foreground">${item.dishPrice.toFixed(2)}</span></p>
                                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRemoveStagedItem(item.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                     <div className="flex items-center gap-2">
                                        <Label htmlFor={`quantity-${item.id}`} className="text-sm">Qty:</Label>
                                        <Input
                                            id={`quantity-${item.id}`}
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => handleStagedItemChange(item.id, 'quantity', parseInt(e.target.value, 10))}
                                            className="h-9 w-20"
                                        />
                                    </div>

                                    {item.hasSpicyOption && (
                                        <RadioGroup 
                                            defaultValue="regular"
                                            value={item.preference}
                                            onValueChange={(value: 'spicy' | 'regular') => handleStagedItemChange(item.id, 'preference', value)}
                                            className="flex items-center gap-4"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="regular" id={`regular-${item.id}`} />
                                                <Label htmlFor={`regular-${item.id}`}>Regular</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="spicy" id={`spicy-${item.id}`} />
                                                <Label htmlFor={`spicy-${item.id}`} className="flex items-center gap-1">Spicy <Flame className="h-4 w-4 text-red-500" /></Label>
                                            </div>
                                        </RadioGroup>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

          <SubmitButton className="w-full font-bold" disabled={stagedItems.length === 0 || !userName}>Add All Items to Order</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
