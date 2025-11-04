import { getDatabase, ref, get, set, child, push, remove } from "firebase/database";
import type { Restaurant, GroupOrder, Dish } from './types';
import { initializeFirebase } from "@/firebase";

// This file is responsible for all interactions with the Firebase Realtime Database.

/**
 * Initializes a connection to the Firebase Realtime Database.
 * This is where we would configure emulator settings for local development.
 */
function getDb() {
    const { database } = initializeFirebase();
    return database;
}


/**
 * Adds a new restaurant to the database along with its menu items.
 * @param restaurantData The restaurant object to add, without 'id' and 'menu'.
 * @param menuItems The array of dish objects to add to the restaurant's menu.
 * @returns The ID of the newly created restaurant.
 */
export async function addRestaurant(restaurantData: Omit<Restaurant, 'id' | 'menu'>, menuItems: Dish[]): Promise<string> {
    const db = getDb();
    const restaurantsRef = ref(db, 'restaurants');
    const newRestaurantRef = push(restaurantsRef);
    const newId = newRestaurantRef.key;
    if (!newId) {
        throw new Error("Failed to generate a new ID for the restaurant.");
    }
    
    // Set the main restaurant data
    await set(newRestaurantRef, restaurantData);

    // Set the menu items in a separate path
    const menuItemsRef = ref(db, `restaurants/${newId}/menuItems`);
    const menuItemsWithIds = menuItems.reduce((acc, item) => {
        const newItemId = push(child(menuItemsRef, 'tmp')).key; // Generate a unique key for the dish
        if (newItemId) {
            acc[newItemId] = { ...item, id: newItemId };
        }
        return acc;
    }, {} as { [key: string]: Dish });

    await set(menuItemsRef, menuItemsWithIds);

    return newId;
}

/**
 * Fetches all restaurants from the database, including their menu items.
 * @returns A promise that resolves to an array of all restaurants.
 */
export async function getRestaurants(): Promise<Restaurant[]> {
    const db = getDb();
    const dbRef = ref(db, 'restaurants');
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
        const restaurantsObject = snapshot.val();
        // Asynchronously fetch menu items for each restaurant
        const restaurantPromises = Object.keys(restaurantsObject).map(async key => {
            const restaurantData = restaurantsObject[key];
            const menuItemsRef = ref(db, `restaurants/${key}/menuItems`);
            const menuSnapshot = await get(menuItemsRef);
            const menu = menuSnapshot.exists() ? Object.values(menuSnapshot.val()) as Dish[] : [];
            
            return {
                id: key,
                ...restaurantData,
                menu: menu,
            };
        });
        return Promise.all(restaurantPromises);
    } else {
        return [];
    }
}


/**
 * Fetches a single restaurant by its ID, including its menu items.
 * @param id The ID of the restaurant to fetch.
 * @returns A promise that resolves to the restaurant object or undefined if not found.
 */
export async function getRestaurantById(id: string): Promise<Restaurant | undefined> {
    const db = getDb();
    const dbRef = ref(db, `restaurants/${id}`);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
        const val = snapshot.val();

        // Fetch menu items from the separate path
        const menuItemsRef = ref(db, `restaurants/${id}/menuItems`);
        const menuSnapshot = await get(menuItemsRef);
        const menu = menuSnapshot.exists() ? Object.values(menuSnapshot.val()) as Dish[] : [];

        return {
            id,
            ...val,
            menu: menu,
        };
    }
    return undefined;
}


/**
 * Fetches all active and recent group orders.
 * @returns A promise that resolves to an array of group orders.
 */
export async function getGroupOrders(): Promise<GroupOrder[]> {
    const dbRef = ref(getDb(), 'groupOrders');
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
        const ordersObject = snapshot.val();
        // Convert the orders object into an array and add the ID to each order.
        return Object.keys(ordersObject).map(key => ({
            id: key,
            ...ordersObject[key],
        })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Sort by most recent
    } else {
        return [];
    }
}

/**
 * Fetches all archived orders from the history.
 * @returns A promise that resolves to an array of historical group orders.
 */
export async function getHistoryOrders(): Promise<GroupOrder[]> {
    const dbRef = ref(getDb(), 'history');
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
        const ordersObject = snapshot.val();
        return Object.keys(ordersObject).map(key => ({
            id: key,
            ...ordersObject[key],
        })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
        return [];
    }
}


/**
 * Fetches a single group order by its ID.
 * @param id The ID of the group order to fetch.
 * @returns A promise that resolves to the group order object or undefined if not found.
 */
export async function getGroupOrderById(id: string): Promise<GroupOrder | undefined> {
    const db = getDb();
    const dbRef = ref(db, `groupOrders/${id}`);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
        const val = snapshot.val();
        
        // Ensure the restaurant object within the order always has a menu array.
        // This might require fetching the restaurant again if the structure is inconsistent
        if (val.restaurant && val.restaurant.id) {
            const restaurant = await getRestaurantById(val.restaurant.id);
            if (restaurant) {
                val.restaurant = restaurant;
            } else {
                 val.restaurant.menu = val.restaurant.menu || [];
            }
        } else if(val.restaurant) {
             val.restaurant.menu = val.restaurant.menu || [];
        }

        return { id, ...val };
    } else {
        // If not in active orders, check history
        const historyRef = ref(db, `history/${id}`);
        const historySnapshot = await get(historyRef);
        if (historySnapshot.exists()) {
            const val = historySnapshot.val();
            if (val.restaurant && val.restaurant.id) {
                const restaurant = await getRestaurantById(val.restaurant.id);
                 if (restaurant) {
                    val.restaurant = restaurant;
                } else {
                    val.restaurant.menu = val.restaurant.menu || [];
                }
            } else if (val.restaurant) {
                val.restaurant.menu = val.restaurant.menu || [];
            }
            return { id, ...val };
        }
    }
    return undefined;
}


/**
 * Adds a new group order to the database.
 * @param order The group order object to add, without the 'id'.
 * @returns The ID of the newly created group order.
 */
export async function addGroupOrder(order: Omit<GroupOrder, 'id'>): Promise<string> {
    const db = getDb();
    const groupOrdersRef = ref(db, 'groupOrders');
    const newOrderRef = push(groupOrdersRef);
    const newId = newOrderRef.key;
    if (!newId) {
        throw new Error("Failed to generate a new ID for the order.");
    }
    
    // We need to strip the menu from the restaurant object before saving
    const { menu, ...restaurantWithoutMenu } = order.restaurant;
    const orderToSave = {
        ...order,
        restaurant: restaurantWithoutMenu,
    };
    
    await set(newOrderRef, orderToSave);
    return newId;
}

/**
 * Updates an existing group order in the database.
 * @param orderId The ID of the order to update.
 * @param updatedOrder The complete updated order object.
 */
export async function updateGroupOrder(orderId: string, updatedOrder: GroupOrder): Promise<void> {
    const db = getDb();
    const { id, ...orderData } = updatedOrder; // The ID is the key, so we don't store it in the object itself.
    
    // We need to strip the menu from the restaurant object before saving
    if (orderData.restaurant) {
        const { menu, ...restaurantWithoutMenu } = orderData.restaurant;
        orderData.restaurant = restaurantWithoutMenu as any;
    }
    
    await set(ref(db, `groupOrders/${orderId}`), orderData);
}

/**
 * Updates an existing restaurant in the database.
 * @param restaurantId The ID of the restaurant to update.
 * @param restaurantData The core restaurant data (without menu).
 * @param menuItems The array of dish objects.
 */
export async function updateRestaurant(restaurantId: string, restaurantData: Omit<Restaurant, 'id' | 'menu'>, menuItems: Dish[]): Promise<void> {
    const db = getDb();
    
    // Update the core restaurant data
    await set(ref(db, `restaurants/${restaurantId}`), restaurantData);

    // Replace the entire menuItems collection for simplicity
    const menuItemsRef = ref(db, `restaurants/${restaurantId}/menuItems`);
    
    const menuItemsWithIds = menuItems.reduce((acc, item) => {
        // Use existing ID or generate a new one if it's a new item
        const newItemId = item.id.startsWith('new-') ? push(child(menuItemsRef, 'tmp')).key : item.id;
        if (newItemId) {
            acc[newItemId] = { ...item, id: newItemId };
        }
        return acc;
    }, {} as { [key: string]: Dish });

    await set(menuItemsRef, menuItemsWithIds);
}


/**
 * Deletes a restaurant from the database, including its menu items.
 * @param restaurantId The ID of the restaurant to delete.
 */
export async function deleteRestaurant(restaurantId: string): Promise<void> {
    const db = getDb();
    // This will delete the restaurant and all its sub-paths (including menuItems)
    await set(ref(db, `restaurants/${restaurantId}`), null);
}


/**
 * Archives a group order by moving it to the 'history' path.
 * @param orderId The ID of the order to archive.
 */
export async function archiveOrder(orderId: string): Promise<void> {
    const db = getDb();
    const orderRef = ref(db, `groupOrders/${orderId}`);
    const snapshot = await get(orderRef);

    if (snapshot.exists()) {
        const orderData = snapshot.val();
        const historyRef = ref(db, `history/${orderId}`);
        
        await set(historyRef, orderData);
        await remove(orderRef);
    } else {
        throw new Error("Order to archive not found.");
    }
}

/**
 * Deletes a group order from the database (permanently). Used for cleaning up history.
 * @param orderId The ID of the order to delete.
 */
export async function deleteOrderFromHistory(orderId: string): Promise<void> {
    const db = getDb();
    await set(ref(db, `history/${orderId}`), null);
}
