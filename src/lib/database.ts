import { getDatabase, ref, get, set, child, push } from "firebase/database";
import type { Restaurant, GroupOrder } from './types';
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
 * Adds a new restaurant to the database.
 * @param restaurant - The restaurant object to add, without the 'id'.
 * @returns The ID of the newly created restaurant.
 */
export async function addRestaurant(restaurant: Omit<Restaurant, 'id'>): Promise<string> {
    const db = getDb();
    const restaurantsRef = ref(db, 'restaurants');
    const newRestaurantRef = push(restaurantsRef);
    const newId = newRestaurantRef.key;
    if (!newId) {
        throw new Error("Failed to generate a new ID for the restaurant.");
    }
    await set(newRestaurantRef, restaurant);
    return newId;
}

/**
 * Fetches all restaurants from the database.
 * @returns A promise that resolves to an array of all restaurants.
 */
export async function getRestaurants(): Promise<Restaurant[]> {
    const dbRef = ref(getDb(), 'restaurants');
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
        const val = snapshot.val();
        // Firebase returns an object where keys are the unique IDs.
        // We convert this object into an array of restaurant objects.
        return Object.keys(val).map(key => ({
            id: key,
            ...val[key],
            menu: val[key].menu || [] // Ensure menu is always an array
        }));
    } else {
        return []; // Return an empty array if no restaurants exist.
    }
}

/**
 * Fetches a single restaurant by its ID.
 * @param id The ID of the restaurant to fetch.
 * @returns A promise that resolves to the restaurant object or undefined if not found.
 */
export async function getRestaurantById(id: string): Promise<Restaurant | undefined> {
    const dbRef = ref(getDb(), `restaurants/${id}`);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
        return { id, ...snapshot.val() };
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
 * Fetches a single group order by its ID.
 * @param id The ID of the group order to fetch.
 * @returns A promise that resolves to the group order object or undefined if not found.
 */
export async function getGroupOrderById(id: string): Promise<GroupOrder | undefined> {
    const dbRef = ref(getDb(), `groupOrders/${id}`);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
        return { id, ...snapshot.val() };
    } else {
        return undefined;
    }
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
    await set(newOrderRef, order);
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
    await set(ref(db, `groupOrders/${orderId}`), orderData);
}

/**
 * Updates an existing restaurant in the database.
 * @param restaurantId The ID of the restaurant to update.
 * @param updatedRestaurant The complete updated restaurant object.
 */
export async function updateRestaurant(restaurantId: string, updatedRestaurant: Restaurant): Promise<void> {
    const db = getDb();
    const { id, ...restaurantData } = updatedRestaurant;
    await set(ref(db, `restaurants/${restaurantId}`), restaurantData);
}
