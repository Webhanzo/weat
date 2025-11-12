'use client';
import { useState, useActionState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2, Minus, Plus } from 'lucide-react';
import type { Participant, OrderItem, Dish } from '@/lib/types';
import { updateParticipantItems, removeParticipant } from '@/lib/actions';
import { SubmitButton } from '../ui/submit-button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type EditParticipantItemsProps = {
  orderId: string;
  participant: Participant;
  menu: Dish[];
};

const initialState = {
  message: "",
  type: "",
};


export default function EditParticipantItems({ orderId, participant, menu }: EditParticipantItemsProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<OrderItem[]>(JSON.parse(JSON.stringify(participant.items)));
  const [state, formAction] = useActionState(updateParticipantItems, initialState);

  const handleQuantityChange = (dishId: string, delta: number) => {
    setItems(currentItems => {
        const newItems = currentItems.map(item => {
            if (item.dish.id === dishId) {
                const newQuantity = item.quantity + delta;
                return { ...item, quantity: newQuantity };
            }
            return item;
        }).filter(item => item.quantity > 0); // Remove item if quantity is 0 or less
      
        if(newItems.length === 0) {
            // If no items are left, we can close the dialog and prompt for deletion
            // Or just allow submitting an empty list. For now, we'll handle it via a separate delete participant button.
        }

        return newItems;
    });
  };

  const handleDishChange = (oldDishId: string, newDishId: string) => {
    const newDish = menu.find(d => d.id === newDishId);
    if (!newDish) return;

    setItems(currentItems => {
      // Check if the new dish is already in the order for this participant
      const existingItemIndex = currentItems.findIndex(item => item.dish.id === newDishId);
      const oldItem = currentItems.find(item => item.dish.id === oldDishId);

      if (existingItemIndex > -1) {
        // If it exists, merge quantities and remove the old item
        return currentItems.map((item, index) => {
          if (index === existingItemIndex) {
            return { ...item, quantity: item.quantity + (oldItem?.quantity || 0) };
          }
          return item;
        }).filter(item => item.dish.id !== oldDishId);
      } else {
        // If it doesn't exist, just replace the old dish with the new one
        return currentItems.map(item => {
          if (item.dish.id === oldDishId) {
            return { ...item, dish: newDish };
          }
          return item;
        });
      }
    });
  }

  const removeParticipantAction = removeParticipant.bind(null, orderId, participant.id);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit Items for {participant.name}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Order for {participant.name}</DialogTitle>
          <DialogDescription>
            Change quantities or remove items from the order. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
            <input type="hidden" name="orderId" value={orderId} />
            <input type="hidden" name="participantId" value={participant.id} />
            <input type="hidden" name="items" value={JSON.stringify(items)} />

            <div className="grid gap-4 py-4 max-h-80 overflow-y-auto pr-4">
                {items.map((item, index) => (
                    <div key={item.dish.id} className="space-y-2">
                      <div className="grid grid-cols-6 items-center gap-2">
                        <div className="col-span-4">
                          <Select 
                            value={item.dish.id} 
                            onValueChange={(newDishId) => handleDishChange(item.dish.id, newDishId)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a dish" />
                            </SelectTrigger>
                            <SelectContent>
                              {menu.map(dish => (
                                <SelectItem key={dish.id} value={dish.id}>
                                  {dish.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2 flex items-center justify-end gap-1">
                             <Button type="button" size="icon" variant="outline" className="h-8 w-8 shrink-0" onClick={() => handleQuantityChange(item.dish.id, -1)}>
                                <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                                id={`item-${index}`}
                                type="number"
                                readOnly
                                value={item.quantity}
                                className="w-12 h-8 text-center"
                            />
                             <Button type="button" size="icon" variant="outline" className="h-8 w-8 shrink-0" onClick={() => handleQuantityChange(item.dish.id, 1)}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground pl-1">{item.dish.description}</p>
                    </div>
                ))}
                {items.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center col-span-4 py-8">
                        All items have been removed. You can remove this participant from the order.
                    </p>
                )}
            </div>
            <DialogFooter>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                         <Button type="button" variant="destructive" className="mr-auto">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Participant
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove {participant.name} and all their items from the order. This action cannot be undone.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <form action={removeParticipantAction}>
                            <AlertDialogAction asChild>
                                <SubmitButton variant="destructive">Yes, remove</SubmitButton>
                            </AlertDialogAction>
                        </form>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <SubmitButton>Save changes</SubmitButton>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
