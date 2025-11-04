"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getRestaurantById, getGroupOrderById, addGroupOrder, updateGroupOrder } from "./data";
import type { GroupOrder, Participant } from "./types";

export async function createOrder(formData: FormData) {
  const restaurantId = formData.get("restaurantId") as string;
  if (!restaurantId) {
    return { error: "Restaurant ID is required." };
  }

  const restaurant = getRestaurantById(restaurantId);
  if (!restaurant) {
    return { error: "Restaurant not found." };
  }

  const newOrder: GroupOrder = {
    id: `ord-${Date.now()}`,
    restaurant,
    participants: [],
    createdAt: new Date().toISOString(),
    status: "active",
  };

  addGroupOrder(newOrder);
  
  revalidatePath("/");
  redirect(`/orders/${newOrder.id}`);
}

export async function addItemToOrder(prevState: any, formData: FormData) {
    const orderId = formData.get("orderId") as string;
    const userName = formData.get("userName") as string;
    const dishId = formData.get("dishId") as string;
    const quantity = parseInt(formData.get("quantity") as string, 10);

    if (!orderId || !userName || !dishId || !quantity) {
        return { message: "Missing required fields.", type: "error" };
    }

    const order = getGroupOrderById(orderId);
    if (!order) {
        return { message: "Order not found.", type: "error" };
    }

    const dish = order.restaurant.menu.find(d => d.id === dishId);
    if (!dish) {
        return { message: "Dish not found.", type: "error" };
    }

    let participant = order.participants.find(p => p.name.toLowerCase() === userName.toLowerCase());

    if (!participant) {
        participant = {
            id: `p-${Date.now()}`,
            name: userName,
            items: [],
        };
        order.participants.push(participant);
    }
    
    const existingItem = participant.items.find(item => item.dish.id === dishId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        participant.items.push({ dish, quantity });
    }

    updateGroupOrder(order.id, order);
    
    revalidatePath(`/orders/${orderId}`);
    return { message: `${quantity}x ${dish.name} added for ${participant.name}.`, type: "success" };
}
