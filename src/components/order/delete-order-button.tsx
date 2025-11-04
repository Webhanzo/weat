'use client';

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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { deleteOrder } from "@/lib/actions";
import { Archive, Trash2 } from "lucide-react";

export default function DeleteOrderButton({ orderId, isFinalized }: { orderId: string, isFinalized: boolean }) {
  const isArchived = !isFinalized;
  const buttonText = isFinalized ? "Archive Order" : "Delete Order";
  const dialogTitle = isFinalized ? "Are you sure you want to archive?" : "Are you absolutely sure?";
  const dialogDescription = isFinalized 
    ? "This will move the order to your history. You can view it there later."
    : "This action cannot be undone. This will permanently delete this order and remove its data from our servers.";
  const confirmText = isFinalized ? "Yes, archive it" : "Yes, delete it";

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full font-bold">
            {isFinalized ? <Archive className="mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
            {buttonText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {dialogDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={deleteOrder}>
            <input type="hidden" name="id" value={orderId} />
            <AlertDialogAction asChild>
                <SubmitButton variant="destructive">
                    {confirmText}
                </SubmitButton>
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
