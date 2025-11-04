import { getDatabase, ref, get, set, child, push } from "firebase/database";
import type { Restaurant, GroupOrder } from './types';
import { initializeFirebase } from "@/firebase";

const { database } = initializeFirebase();

export async function addRestaurant(restaurant: Omit<Restaurant, 'id'>): Promise<string> {
    const db = getDatabase();
    const restaurantsRef = ref(db, 'restaurants');
    const newRestaurantRef = push(restaurantsRef);
    const newId = newRestaurantRef.key;
    if (!newId) {
        throw new Error("Failed to generate a new ID for the restaurant.");
    }
    await set(newRestaurantRef, restaurant);
    return newId;
}

export async function getRestaurants(): Promise<Restaurant[]> {
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, 'restaurants'));
    if (snapshot.exists()) {
        const val = snapshot.val();
        // Firebase returns an object, convert it to a real array
        return Object.keys(val).map(key => ({ id: key, ...val[key] })) as Restaurant[];
    } else {
        return [];
    }
}

export async function getRestaurantById(id: string): Promise<Restaurant | undefined> {
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, `restaurants/${id}`));
    if(snapshot.exists()) {
        return { id, ...snapshot.val() };
    }
    return undefined;
}

export async function getGroupOrders(): Promise<GroupOrder[]> {
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, 'groupOrders'));
    if (snapshot.exists()) {
        const ordersObject = snapshot.val();
        // Convert object to array
        return Object.keys(ordersObject).map(key => ({
            ...ordersObject[key],
            id: key,
        }));
    } else {
        return [];
    }
}

export async function getGroupOrderById(id: string): Promise<GroupOrder | undefined> {
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, `groupOrders/${id}`));
    if (snapshot.exists()) {
        return { ...snapshot.val(), id };
    } else {
        return undefined;
    }
}

export async function addGroupOrder(order: Omit<GroupOrder, 'id'>): Promise<string> {
    const db = getDatabase();
    const groupOrdersRef = ref(db, 'groupOrders');
    const newOrderRef = push(groupOrdersRef);
    const newId = newOrderRef.key;
    if (!newId) {
        throw new Error("Failed to generate a new ID for the order.");
    }
    await set(newOrderRef, order);
    return newId;
}

export async function updateGroupOrder(orderId: string, updatedOrder: GroupOrder): Promise<void> {
    const db = getDatabase();
    // we don't want to save the id in the object itself
    const { id, ...orderData } = updatedOrder;
    await set(ref(db, `groupOrders/${orderId}`), orderData);
}

export async function updateRestaurant(restaurantId: string, updatedRestaurant: Restaurant): Promise<void> {
    const db = getDatabase();
    const { id, ...restaurantData } = updatedRestaurant;
    await set(ref(db, `restaurants/${restaurantId}`), restaurantData);
}
