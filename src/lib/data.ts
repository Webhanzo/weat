import type { Restaurant, GroupOrder } from './types';

const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Pizza Palace',
    description: 'Authentic Italian pizzas with a modern twist. Fresh ingredients, classic recipes.',
    image: 'https://picsum.photos/seed/10/600/400',
    deliveryFee: 5.00,
    menu: [
      { id: '1-1', name: 'Margherita', description: 'Classic cheese and tomato', price: 12.99 },
      { id: '1-2', name: 'Pepperoni', description: 'Loaded with pepperoni', price: 14.99 },
      { id: '1-3', name: 'Veggie Supreme', description: 'A garden on a pizza', price: 13.99 },
      { id: '1-4', name: 'Garlic Bread', description: 'Cheesy garlic bread sticks', price: 6.99 },
    ],
  },
  {
    id: '2',
    name: 'Sushi Den',
    description: 'The freshest sushi and sashimi in town. Experience the taste of Japan.',
    image: 'https://picsum.photos/seed/11/600/400',
    deliveryFee: 7.50,
    menu: [
      { id: '2-1', name: 'California Roll', description: 'Crab, avocado, cucumber', price: 8.00 },
      { id: '2-2', name: 'Spicy Tuna Roll', description: 'Tuna with spicy mayo', price: 9.50 },
      { id: '2-3', name: 'Salmon Nigiri', description: '2 pieces of fresh salmon', price: 6.00 },
      { id: '2-4', name: 'Miso Soup', description: 'Traditional Japanese soup', price: 3.00 },
    ],
  },
  {
    id: '3',
    name: 'Burger Joint',
    description: 'Gourmet burgers, crispy fries, and thick shakes. A true American classic.',
    image: 'https://picsum.photos/seed/12/600/400',
    deliveryFee: 4.00,
    menu: [
      { id: '3-1', name: 'Classic Cheeseburger', description: 'Beef patty, cheese, lettuce, tomato', price: 10.50 },
      { id: '3-2', name: 'Bacon Burger', description: 'Beef patty with crispy bacon', price: 12.00 },
      { id: '3-3', name: 'Fries', description: 'Golden crispy fries', price: 4.00 },
      { id: '3-4', name: 'Milkshake', description: 'Chocolate, Vanilla, or Strawberry', price: 5.50 },
    ],
  },
  {
    id: '4',
    name: 'Taco Fiesta',
    description: 'Authentic Mexican street tacos and burritos. Full of flavor and spice.',
    image: 'https://picsum.photos/seed/13/600/400',
    deliveryFee: 3.50,
    menu: [
      { id: '4-1', name: 'Carne Asada Taco', description: 'Grilled steak taco', price: 3.50 },
      { id: '4-2', name: 'Al Pastor Taco', description: 'Marinated pork taco', price: 3.50 },
      { id: '4-3', name: 'Chicken Burrito', description: 'Large burrito with chicken and beans', price: 11.00 },
      { id: '4-4', name: 'Chips and Guacamole', description: 'Freshly made guacamole', price: 7.00 },
    ],
  },
];

let groupOrders: GroupOrder[] = [
    {
        id: 'ord-123',
        restaurant: restaurants[0],
        participants: [
            {
                id: 'p-1',
                name: 'Alice',
                items: [{ dish: restaurants[0].menu[0], quantity: 1 }],
            },
            {
                id: 'p-2',
                name: 'Bob',
                items: [{ dish: restaurants[0].menu[1], quantity: 2 }],
            }
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        status: 'active'
    }
];

export const getRestaurants = () => restaurants;
export const getRestaurantById = (id: string) => restaurants.find(r => r.id === id);

export const getGroupOrders = () => groupOrders;
export const getGroupOrderById = (id: string) => groupOrders.find(o => o.id === id);

export const addGroupOrder = (order: GroupOrder) => {
    groupOrders.unshift(order);
};

export const updateGroupOrder = (orderId: string, updatedOrder: GroupOrder) => {
    const orderIndex = groupOrders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        groupOrders[orderIndex] = updatedOrder;
    }
}
