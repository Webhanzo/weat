'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListCollapse, Copy } from "lucide-react";
import type { GroupOrder } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

type CollatedOrderListProps = {
  order: GroupOrder;
};

type AggregatedItem = {
  name: string;
  quantity: number;
};

export default function CollatedOrderList({ order }: CollatedOrderListProps) {
  const { toast } = useToast();

  const aggregatedList: AggregatedItem[] = useMemo(() => {
    const itemMap = new Map<string, AggregatedItem>();

    order.participants?.forEach(participant => {
      participant.items.forEach(item => {
        const existingItem = itemMap.get(item.dish.id);
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          itemMap.set(item.dish.id, {
            name: item.dish.name,
            quantity: item.quantity,
          });
        }
      });
    });

    return Array.from(itemMap.values()).sort((a, b) => b.quantity - a.quantity);
  }, [order.participants]);

  const handleCopy = () => {
    if (aggregatedList.length === 0) return;

    const textToCopy = aggregatedList
      .map(item => `${item.quantity}x ${item.name}`)
      .join('\n');

    navigator.clipboard.writeText(textToCopy).then(() => {
      toast({
        title: "Copied to clipboard!",
        description: "The collated order list is ready to be pasted.",
      });
    }).catch(err => {
      console.error("Failed to copy text: ", err);
      toast({
        title: "Copy Failed",
        description: "Could not copy the list to your clipboard.",
        variant: "destructive",
      });
    });
  };

  if (aggregatedList.length === 0) {
    return null; // Don't render the card if there are no items
  }

  return (
    <Card className="shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center">
          <ListCollapse className="h-6 w-6 mr-3 text-accent" />
          Collated List
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {aggregatedList.map((item, index) => (
            <li key={index} className="flex justify-between items-center p-2 bg-background rounded-md">
              <span className="font-semibold">{item.name}</span>
              <span className="font-bold text-lg text-primary">x{item.quantity}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button onClick={handleCopy} className="w-full font-bold" variant="secondary">
          <Copy className="mr-2 h-4 w-4" />
          Copy List
        </Button>
      </CardFooter>
    </Card>
  );
}
