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
  const buttonText = "Archive Order";
  const dialogTitle = "Are you sure you want to archive?";
  const dialogDescription = "This will move the order to your history. You can view it there later by searching its code.";
  const confirmText = "Yes, archive it";

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full font-bold" disabled={!isFinalized}>
            <Archive className="mr-2 h-4 w-4" />
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
