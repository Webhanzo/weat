'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getRestaurantById, getGroupOrderById, addGroupOrder, updateGroupOrder, addRestaurant as addRestaurantToDb, updateRestaurant as updateRestaurantInDb, deleteRestaurant as deleteRestaurantFromDb, archiveOrder } from "./database";
import type { GroupOrder, Participant, Restaurant, Dish } from "./types";

export async function createOrder(formData: FormData) {
  const restaurantId = formData.get("restaurantId") as string;
  let newOrderId;
  if (!restaurantId) {
    return { error: "Restaurant ID is required." };
  }

  try {
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

    newOrderId = await addGroupOrder(newOrder);

  } catch (error: any) {
     return { error: `Failed to create order: ${error.message}` };
  }

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

    if (order.status !== 'active') {
        return { message: "This order is finalized and can no longer be modified.", type: "error"};
    }

    const dish = order.restaurant.menu?.find(d => d.id === dishId);
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
    }
    
    const existingItem = participant.items.find(item => item.dish.id === dishId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        participant.items.push({ dish, quantity });
    }

    // Since we mutated participant, we need to update the participants array
    const participantIndex = participants.findIndex(p => p.id === participant!.id);
    if (participantIndex > -1) {
        participants[participantIndex] = participant;
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
    const categoryData = formData.get('category') as string;
    const menuData = formData.get('menu') as string;

    if (!name || !description || !image || isNaN(deliveryFee) || !categoryData) {
        return { message: "Please fill all required fields for the restaurant.", type: 'error' };
    }

    let category: string[] = [];
    try {
        category = JSON.parse(categoryData);
        if (!Array.isArray(category) || category.length === 0) {
            return { message: 'Please select at least one category.', type: 'error' };
        }
    } catch (e) {
        return { message: 'Invalid category format.', type: 'error' };
    }


    let menu: Dish[] = [];
    if (menuData) {
        try {
            const parsedMenu: Omit<Dish, 'id'>[] = JSON.parse(menuData);
             if (Array.isArray(parsedMenu)) {
                menu = parsedMenu.map(item => ({
                    id: item.id || `dish-${Date.now()}-${Math.random()}`,
                    ...item,
                    price: Number(item.price) || 0,
                    description: item.description || ''
                }));
            }
        } catch (e: any) {
            return { message: `Invalid menu format: ${e.message}`, type: 'error' };
        }
    }

    const newRestaurantData: Omit<Restaurant, 'id' | 'menu'> = {
        name,
        description,
        image,
        deliveryFee,
        category,
    };

    try {
        await addRestaurantToDb(newRestaurantData, menu);
    } catch (e: any) {
        return { message: `Failed to add restaurant: ${e.message}`, type: 'error' };
    }

    revalidatePath('/orders/create');
    revalidatePath('/restaurants/add');
    redirect('/orders/create');
}

export async function updateRestaurant(prevState: any, formData: FormData) {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const image = formData.get('image') as string;
    const deliveryFee = parseFloat(formData.get('deliveryFee') as string);
    const categoryData = formData.get('category') as string;
    const menuData = formData.get('menu') as string;

    if (!id || !name || !description || !image || isNaN(deliveryFee) || !categoryData) {
        return { message: "Please fill all required fields.", type: 'error' };
    }

    let category: string[] = [];
    try {
        category = JSON.parse(categoryData);
        if (!Array.isArray(category) || category.length === 0) {
            return { message: 'Please select at least one category.', type: 'error' };
        }
    } catch (e) {
        return { message: 'Invalid category format.', type: 'error' };
    }


    let menu: Dish[] = [];
    if (menuData) {
        try {
            const parsedMenu: Dish[] = JSON.parse(menuData);
            if (Array.isArray(parsedMenu)) {
                menu = parsedMenu.map(item => ({
                    ...item,
                    price: Number(item.price) || 0,
                    description: item.description || ''
                }));
            }
        } catch (e: any) {
            return { message: `Invalid menu format: ${e.message}`, type: 'error' };
        }
    }

    const restaurantData: Omit<Restaurant, 'id' | 'menu'> = {
        name,
        description,
        image,
        deliveryFee,
        category,
    };

    try {
        await updateRestaurantInDb(id, restaurantData, menu);
    } catch (e: any) {
        return { message: `Failed to update restaurant: ${e.message}`, type: 'error' };
    }
    
    revalidatePath(`/restaurants/${id}/edit`);
    revalidatePath(`/orders/create`);
    revalidatePath(`/`);
    redirect('/orders/create');
}


export async function finalizeOrder(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  if (!orderId) {
    // This should ideally return a state for the form
    throw new Error("Order ID is required.");
  }

  const order = await getGroupOrderById(orderId);
  if (!order) {
    throw new Error("Order not found.");
  }
  
  order.status = 'finalized';

  await updateGroupOrder(order.id, order);
  
  revalidatePath(`/orders/${orderId}`);
  revalidatePath('/orders/history');
  revalidatePath('/');
}

export async function deleteRestaurant(formData: FormData) {
    const id = formData.get('id') as string;
    if (!id) {
        return;
    }

    try {
        await deleteRestaurantFromDb(id);
    } catch (error) {
        console.error("Failed to delete restaurant:", error);
        return; 
    }

    revalidatePath('/orders/create');
    revalidatePath('/restaurants/add');
    revalidatePath('/');
    redirect('/orders/create');
}

export async function deleteOrder(formData: FormData) {
    const id = formData.get('id') as string;
    if (!id) {
        return;
    }

    try {
        // This now moves the order to the history path instead of deleting it.
        await archiveOrder(id);
    } catch (error) {
        console.error("Failed to archive order:", error);
        return; 
    }

    revalidatePath(`/orders/${id}`);
    revalidatePath('/orders/history');
    revalidatePath('/');
    redirect('/orders/history');
}
