export type Dish = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string; // Added category for the dish
  rating?: number;
  ratingCount?: number;
};

export type Restaurant = {
  id: string;
  name: string;
  description: string;
  image: string;
  deliveryFee: number;
  menu: Dish[];
  category: string[];
  rating?: number;
  ratingCount?: number;
};

export type OrderItem = {
  dish: Dish;
  quantity: number;
};

export type Participant = {
  id:string;
  name: string;
  items: OrderItem[];
};

export type Rating = {
  userId: string; // Could be participant name for simplicity in this app
  restaurantRating: number;
  dishRatings: { [dishId: string]: number };
}

export type GroupOrder = {
  id: string;
  restaurant: Restaurant;
  participants: Participant[];
  createdAt: string;
  status: 'active' | 'finalized' | 'cancelled';
  orderCode: string;
  ratings?: { [userId: string]: Rating };
};

export type DishSearchResult = {
  dish: Dish;
  restaurantName: string;
  restaurantId: string;
  deliveryFee: number;
}
