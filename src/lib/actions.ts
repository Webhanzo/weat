"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getRestaurantById, getGroupOrderById, addGroupOrder, updateGroupOrder, addRestaurant as addRestaurantToDb } from "./database";
import type { GroupOrder, Participant, Restaurant, Dish } from "./types";

export async function createOrder(formData: FormData) {
  const restaurantId = formData.get("restaurantId") as string;
  if (!restaurantId) {
    return { error: "Restaurant ID is required." };
  }

  const restaurant = await getRestaurantById(restaurantId);
  if (!restaurant) {
    return { error: "Restaurant not found." };
  }

  const newOrder: Omit<GroupOrder, 'id'> = {
    restaurant,
    participants: [],
    createdAt: new Date().toISOString(),
    status: "active",
  };

  const newOrderId = await addGroupOrder(newOrder);
  
  revalidatePath("/");
  redirect(`/orders/${newOrderId}`);
}

export async function addItemToOrder(prevState: any, formData: FormData) {
    const orderId = formData.get("orderId") as string;
    const userName = formData.get("userName") as string;
    const dishId = formData.get("dishId") as string;
    const quantity = parseInt(formData.get("quantity") as string, 10);

    if (!orderId || !userName || !dishId || !quantity) {
        return { message: "Missing required fields.", type: "error" };
    }

    const order = await getGroupOrderById(orderId);
    if (!order) {
        return { message: "Order not found.", type: "error" };
    }

    const dish = order.restaurant.menu.find(d => d.id === dishId);
    if (!dish) {
        return { message: "Dish not found.", type: "error" };
    }

    let participants = order.participants || [];
    let participant = participants.find(p => p.name.toLowerCase() === userName.toLowerCase());

    if (!participant) {
        participant = {
            id: `p-${Date.now()}`,
            name: userName,
            items: [],
        };
        participants.push(participant);
    } else {
        // create new array with updated participant
        participants = participants.map(p => p.id === participant!.id ? participant! : p);
    }
    
    const existingItem = participant.items.find(item => item.dish.id === dishId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        participant.items.push({ dish, quantity });
    }

    const updatedOrder = {
        ...order,
        participants,
    };

    await updateGroupOrder(order.id, updatedOrder);
    
    revalidatePath(`/orders/${orderId}`);
    return { message: `${quantity}x ${dish.name} added for ${participant.name}.`, type: "success" };
}

export async function addRestaurant(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const image = formData.get('image') as string;
    const deliveryFee = parseFloat(formData.get('deliveryFee') as string);
    const menuData = formData.get('menu') as string;

    if (!name || !description || !image || isNaN(deliveryFee)) {
        return { message: "Please fill all required fields for the restaurant.", type: 'error' };
    }

    let menu: Dish[] = [];
    if (menuData) {
        try {
            const parsedMenu = JSON.parse(menuData);
            if(Array.isArray(parsedMenu)) {
                menu = parsedMenu.map((item: any, index: number) => ({
                    id: `${Date.now()}-${index}`,
                    name: String(item.name),
                    description: String(item.description),
                    price: parseFloat(item.price),
                }));
            }
        } catch (e) {
            return { message: 'Invalid menu format. Please check your JSON.', type: 'error' };
        }
    }

    const newRestaurant: Omit<Restaurant, 'id'> = {
        name,
        description,
        image,
        deliveryFee,
        menu,
    };

    try {
        const newId = await addRestaurantToDb(newRestaurant);
        revalidatePath('/orders/create');
        revalidatePath('/restaurants/add');
        return { message: `Restaurant "${name}" added successfully with ID ${newId}.`, type: 'success' };
    } catch (e: any) {
        return { message: `Failed to add restaurant: ${e.message}`, type: 'error' };
    }
}
