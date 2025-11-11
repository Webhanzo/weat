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
export async function addRestaurant(restaurantData: Omit<Restaurant, 'id' | 'menu'>, menuItems: Omit<Dish, 'id'>[]): Promise<string> {
    const db = getDb();
    const restaurantsRef = ref(db, 'restaurants');
    const newRestaurantRef = push(restaurantsRef);
    const newId = newRestaurantRef.key;
    if (!newId) {
        throw new Error("Failed to generate a new ID for the restaurant.");
    }
    
    // Set the main restaurant data (without the menu)
    await set(newRestaurantRef, restaurantData);

    // Set the menu items in a separate path: restaurants/{restaurantId}/menuItems
    if (menuItems && menuItems.length > 0) {
        const menuItemsRef = ref(db, `restaurants/${newId}/menuItems`);
        const menuItemsWithIds: { [key: string]: Dish } = {};
        
        for (const item of menuItems) {
            const newItemId = push(menuItemsRef).key;
            if(newItemId) {
                menuItemsWithIds[newItemId] = { ...item, id: newItemId };
            }
        }
        await set(menuItemsRef, menuItemsWithIds);
    }

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
        const orders = await Promise.all(Object.keys(ordersObject).map(async key => {
            const orderData = ordersObject[key];
            // Ensure we get the full restaurant details including the menu
            if (orderData.restaurant && orderData.restaurant.id) {
                const fullRestaurant = await getRestaurantById(orderData.restaurant.id);
                if (fullRestaurant) {
                    orderData.restaurant = fullRestaurant;
                }
            }
            return {
                id: key,
                ...orderData,
            };
        }));
        return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Sort by most recent
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
        const orders = await Promise.all(Object.keys(ordersObject).map(async key => {
             const orderData = ordersObject[key];
            // Ensure we get the full restaurant details including the menu
            if (orderData.restaurant && orderData.restaurant.id) {
                const fullRestaurant = await getRestaurantById(orderData.restaurant.id);
                if (fullRestaurant) {
                    orderData.restaurant = fullRestaurant;
                }
            }
            return {
                id: key,
                ...orderData,
            };
        }));
        return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
        return [];
    }
}


/**
 * Fetches a single group order by its ID from either active orders or history.
 * @param id The ID of the group order to fetch.
 * @returns A promise that resolves to the group order object or undefined if not found.
 */
export async function getGroupOrderById(id: string): Promise<GroupOrder | undefined> {
    const db = getDb();
    
    async function fetchOrderFromPath(path: string): Promise<GroupOrder | undefined> {
        const orderRef = ref(db, path);
        const snapshot = await get(orderRef);
        if (snapshot.exists()) {
            const val = snapshot.val();
            
            // Ensure the restaurant object within the order always has its full menu.
            if (val.restaurant && val.restaurant.id) {
                const restaurant = await getRestaurantById(val.restaurant.id);
                if (restaurant) {
                    val.restaurant = restaurant;
                } else {
                    // If restaurant is deleted, keep the partial data but ensure menu is an array
                    val.restaurant.menu = val.restaurant.menu || [];
                }
            } else if(val.restaurant) {
                // Fallback if restaurant object is missing an ID but exists
                val.restaurant.menu = val.restaurant.menu || [];
            }
            
            return { id, ...val };
        }
        return undefined;
    }

    // Try fetching from active orders first
    let order = await fetchOrderFromPath(`groupOrders/${id}`);
    if (order) {
        return order;
    }
    
    // If not found, check history
    order = await fetchOrderFromPath(`history/${id}`);
    return order;
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
    
    // We need to strip the menu from the restaurant object before saving to avoid data duplication
    const { menu, ...restaurantWithoutMenu } = order.restaurant;
    const orderToSave = {
        ...order,
        restaurant: restaurantWithoutMenu, // only store restaurant reference/details, not the full menu
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
    
    // Strip the menu from the restaurant object to avoid duplicating data
    if (orderData.restaurant) {
        // The menu might not exist if it was already stripped, so we check
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
    const restaurantRef = ref(db, `restaurants/${restaurantId}`);
    await set(restaurantRef, restaurantData);

    // Replace the entire menuItems collection for simplicity
    const menuItemsRef = ref(db, `restaurants/${restaurantId}/menuItems`);
    
    const menuItemsWithIds: { [key: string]: Dish } = {};
    if (menuItems && menuItems.length > 0) {
        for (const item of menuItems) {
            // Use existing ID or generate a new one if it's a new item (e.g., starts with 'new-')
            const newItemId = item.id && !item.id.startsWith('new-') ? item.id : push(menuItemsRef).key;
            if (newItemId) {
                menuItemsWithIds[newItemId] = { ...item, id: newItemId };
            }
        }
    }

    // Set the new menu, this will overwrite any existing menu items
    await set(menuItemsRef, menuItemsWithIds);
}


/**
 * Deletes a restaurant from the database, including its menu items.
 * @param restaurantId The ID of the restaurant to delete.
 */
export async function deleteRestaurant(restaurantId: string): Promise<void> {
    const db = getDb();
    // This will delete the restaurant and all its sub-paths (including menuItems)
    await remove(ref(db, `restaurants/${restaurantId}`));
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
        
        // Strip menu from restaurant object if it exists to avoid archival bloat
        if (orderData.restaurant && orderData.restaurant.menu) {
            const { menu, ...restaurantWithoutMenu } = orderData.restaurant;
            orderData.restaurant = restaurantWithoutMenu;
        }

        const historyRef = ref(db, `history/${orderId}`);
        await set(historyRef, orderData);
        await remove(orderRef);
    } else {
        // If it's not in groupOrders, it might be an attempt to delete an already archived order.
        // For now, we'll throw an error, but this could be handled differently.
        const historyRef = ref(db, `history/${orderId}`);
        const historySnapshot = await get(historyRef);
        if (historySnapshot.exists()) {
             // If the user wants to delete from history, we can do that here.
             await remove(historyRef);
        } else {
            throw new Error("Order to archive or delete not found.");
        }
    }
}

/**
 * Deletes a group order from the database (permanently). Used for cleaning up history.
 * @param orderId The ID of the order to delete.
 */
export async function deleteOrderFromHistory(orderId: string): Promise<void> {
    const db = getDb();
    await remove(ref(db, `history/${orderId}`));
}
