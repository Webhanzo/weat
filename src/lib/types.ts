export type Dish = {
  id: string;
  name: string;
  description: string;
  price: number;
};

export type Restaurant = {
  id: string;
  name: string;
  description: string;
  image: string;
  deliveryFee: number;
  menu: Dish[];
  category: string[];
};

export type OrderItem = {
  dish: Dish;
  quantity: number;
};

export type Participant = {
  id:string;
  name: string;
  cliqAlias?: string;
  items: OrderItem[];
};

export type GroupOrder = {
  id: string;
  restaurant: Restaurant;
  participants: Participant[];
  createdAt: string;
  status: 'active' | 'finalized' | 'cancelled';
};
