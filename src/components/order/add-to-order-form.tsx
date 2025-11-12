'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { addItemToOrder } from '@/lib/actions';
import type { GroupOrder, Dish } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SubmitButton } from '@/components/ui/submit-button';
import { PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type AddToOrderFormProps = {
    order: GroupOrder;
};

const initialState = {
  message: '',
  type: ''
};

export default function AddToOrderForm({ order }: AddToOrderFormProps) {
  const [state, formAction] = useActionState(addItemToOrder, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  const handleDishChange = (dishId: string) => {
    const dish = order.restaurant.menu?.find(d => d.id === dishId) || null;
    setSelectedDish(dish);
  };

  useEffect(() => {
    if (state.message) {
      if(state.type === 'success') {
        toast({
            title: 'Success!',
            description: state.message,
        });
        formRef.current?.reset();
        setSelectedDish(null);
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
          <div className="space-y-2">
            <Label htmlFor="userName">Your Name</Label>
            <Input id="userName" name="userName" placeholder="e.g., Jane Doe" required />
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
              <Label htmlFor="dishId">Menu Item</Label>
              <Select name="dishId" required onValueChange={handleDishChange}>
                <SelectTrigger id="dishId">
                  <SelectValue placeholder="Select a dish to add" />
                </SelectTrigger>
                <SelectContent>
                  {order.restaurant.menu && order.restaurant.menu.map(dish => (
                    <SelectItem key={dish.id} value={dish.id}>
                      {dish.name} - ${dish.price.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
               {selectedDish?.description && (
                <p className="text-sm text-muted-foreground pt-1 animate-in fade-in-50">
                  {selectedDish.description}
                </p>
              )}
            </div>
             <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" name="quantity" type="number" defaultValue="1" min="1" required />
            </div>
          </div>
          <SubmitButton className="w-full font-bold">Add to Order</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
