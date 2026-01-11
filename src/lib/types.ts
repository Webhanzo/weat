export type Dish = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  hasSpicyOption?: boolean; // Can this dish be made spicy?
  rating?: number;
  ratingCount?: number;
};

export type Restaurant = {
  id: string;
  name: string;
  description: string;
  image: string;
  menu: Dish[];
  category: string[];
  phoneNumber?: string;
  rating?: number;
  ratingCount?: number;
};

export type OrderItem = {
  dish: Dish;
  quantity: number;
  preference?: 'spicy' | 'regular'; // User's choice
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
  deliveryFee: number;
};

export type DishSearchResult = {
  dish: Dish;
  restaurantName: string;
  restaurantId: string;
}
