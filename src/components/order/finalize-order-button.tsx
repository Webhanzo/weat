'use client';

import { finalizeOrder } from "@/lib/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { CheckCircle } from "lucide-react";

export default function FinalizeOrderButton({ orderId }: { orderId: string }) {
  return (
    <form action={finalizeOrder}>
      <input type="hidden" name="orderId" value={orderId} />
      <SubmitButton className="w-full font-bold" variant="secondary">
        <CheckCircle className="mr-2 h-4 w-4" />
        Finalize This Order
      </SubmitButton>
    </form>
  );
}
