import type { Restaurant, GroupOrder } from './types';

const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Kendo',
    description: 'Specializing in delicious Shawerma.',
    image: 'https://picsum.photos/seed/kendo/600/400',
    deliveryFee: 5.00,
    menu: [
      { id: '1-1', name: 'Shawerma', description: 'Classic shawerma wrap', price: 3.50 },
    ],
  },
  {
    id: '2',
    name: 'Hanayen',
    description: 'A variety of choices from Shawerma to Grills.',
    image: 'https://picsum.photos/seed/hanayen/600/400',
    deliveryFee: 4.50,
    menu: [
      { id: '2-1', name: 'Shawerma', description: 'Tasty shawerma sandwich', price: 4.00 },
      { id: '2-2', name: 'Grill', description: 'Mixed grill platter', price: 12.00 },
    ],
  },
  {
    id: '3',
    name: 'Reef',
    description: 'Famous for its unique Shawerma.',
    image: 'https://picsum.photos/seed/reef/600/400',
    deliveryFee: 3.00,
    menu: [
      { id: '3-1', name: 'Shawerma', description: 'Reef special shawerma', price: 4.25 },
    ],
  },
  {
    id: '4',
    name: 'daye3a',
    description: 'Authentic village-style Shawerma.',
    image: 'https://picsum.photos/seed/daye3a/600/400',
    deliveryFee: 5.00,
    menu: [
      { id: '4-1', name: 'Shawerma', description: 'Traditional shawerma', price: 3.75 },
    ],
  },
  {
    id: '5',
    name: 'Shawerma 3 alsaj',
    description: 'Shawerma cooked on a traditional saj.',
    image: 'https://picsum.photos/seed/alsaj/600/400',
    deliveryFee: 4.00,
    menu: [
      { id: '5-1', name: 'Saj Shawerma', description: 'Shawerma in saj bread', price: 5.00 },
    ],
  },
  {
    id: '6',
    name: 'Haneeni',
    description: 'A wide menu including Shawerma, Broasted, Grills and Snacks.',
    image: 'https://picsum.photos/seed/haneeni/600/400',
    deliveryFee: 3.50,
    menu: [
      { id: '6-1', name: 'Shawerma', description: 'Haneeni special shawerma', price: 4.50 },
      { id: '6-2', name: 'Broasted Chicken', description: 'Crispy broasted chicken meal', price: 7.00 },
      { id: '6-3', name: 'Mixed Grill', description: 'Assortment of grilled meats', price: 15.00 },
    ],
  },
  {
    id: '7',
    name: 'Bab tuma',
    description: 'Damascene flavors with excellent Shawerma.',
    image: 'https://picsum.photos/seed/babtuma/600/400',
    deliveryFee: 5.50,
    menu: [
      { id: '7-1', name: 'Shawerma', description: 'Syrian style shawerma', price: 4.00 },
    ],
  },
  {
    id: '8',
    name: 'الوجبة الذهبية',
    description: 'The Golden Meal for Shawerma and Broasted lovers.',
    image: 'https://picsum.photos/seed/goldenmeal/600/400',
    deliveryFee: 3.00,
    menu: [
      { id: '8-1', name: 'Shawerma', description: 'Golden shawerma sandwich', price: 4.00 },
      { id: '8-2', name: 'Broasted', description: 'Golden broasted chicken', price: 6.50 },
    ],
  },
  {
    id: '9',
    name: 'Tortilla',
    description: 'Shawerma with a Mexican twist.',
    image: 'https://picsum.photos/seed/tortilla/600/400',
    deliveryFee: 4.50,
    menu: [
      { id: '9-1', name: 'Shawerma Tortilla', description: 'Shawerma in a tortilla wrap', price: 5.50 },
    ],
  },
  {
    id: '10',
    name: 'Nejm eldeen',
    description: 'Star of Broasted and Zinger sandwiches.',
    image: 'https://picsum.photos/seed/nejmeldeen/600/400',
    deliveryFee: 4.00,
    menu: [
      { id: '10-1', name: 'Broasted', description: '4-piece broasted meal', price: 6.00 },
      { id: '10-2', name: 'Zinger Sandwich', description: 'Spicy zinger sandwich', price: 5.00 },
    ],
  },
  {
    id: '11',
    name: 'Hum Hum',
    description: 'Deliciously cooked Broasted chicken.',
    image: 'https://picsum.photos/seed/humhum/600/400',
    deliveryFee: 4.00,
    menu: [
      { id: '11-1', name: 'Broasted', description: 'Hum Hum special broasted', price: 6.75 },
    ],
  },
  {
    id: '12',
    name: 'Crunchy',
    description: 'Get your crunch on with our Broasted chicken.',
    image: 'https://picsum.photos/seed/crunchy/600/400',
    deliveryFee: 3.50,
    menu: [
      { id: '12-1', name: 'Crunchy Broasted', description: 'Extra crunchy chicken', price: 7.25 },
    ],
  },
  {
    id: '13',
    name: 'Crispy',
    description: 'Perfectly crispy Broasted chicken every time.',
    image: 'https://picsum.photos/seed/crispy/600/400',
    deliveryFee: 3.75,
    menu: [
      { id: '13-1', name: 'Crispy Broasted', description: 'Crispy chicken meal', price: 7.00 },
    ],
  },
  {
    id: '14',
    name: 'Nashville',
    description: 'Hot and spicy Nashville-style Broasted chicken.',
    image: 'https://picsum.photos/seed/nashville/600/400',
    deliveryFee: 5.00,
    menu: [
      { id: '14-1', name: 'Nashville Hot Chicken', description: 'Spicy broasted chicken', price: 8.00 },
    ],
  },
  {
    id: '15',
    name: 'Kumpasta',
    description: 'Loaded baked potatoes and other great snacks.',
    image: 'https://picsum.photos/seed/kumpasta/600/400',
    deliveryFee: 4.00,
    menu: [
      { id: '15-1', name: 'Kumpir', description: 'Loaded baked potato with your choice of toppings', price: 6.00 },
    ],
  },
  {
    id: '16',
    name: 'Reham',
    description: 'A variety of tasty snacks.',
    image: 'https://picsum.photos/seed/reham/600/400',
    deliveryFee: 3.00,
    menu: [
      { id: '16-1', name: 'Snack Platter', description: 'Assortment of small bites', price: 9.00 },
    ],
  },
  {
    id: '17',
    name: 'Hamdan sandwiches',
    description: 'Quick and delicious sandwiches for any time.',
    image: 'https://picsum.photos/seed/hamdan/600/400',
    deliveryFee: 2.50,
    menu: [
      { id: '17-1', name: 'Falafel Sandwich', description: 'Classic falafel sandwich', price: 1.50 },
    ],
  },
  {
    id: '18',
    name: 'Lebnani snack',
    description: 'Authentic Lebanese snacks and Zinger.',
    image: 'https://picsum.photos/seed/lebnani/600/400',
    deliveryFee: 4.50,
    menu: [
      { id: '18-1', name: 'Zinger', description: 'Lebanese-style zinger', price: 5.50 },
    ],
  },
  {
    id: '19',
    name: 'Wings Master',
    description: 'The master of chicken wings.',
    image: 'https://picsum.photos/seed/wingsmaster/600/400',
    deliveryFee: 5.00,
    menu: [
      { id: '19-1', name: 'BBQ Wings', description: '10 pieces of BBQ wings', price: 9.00 },
    ],
  },
  {
    id: '20',
    name: 'Wingers',
    description: 'Serving up delicious Wings and Burgers.',
    image: 'https://picsum.photos/seed/wingers/600/400',
    deliveryFee: 4.50,
    menu: [
      { id: '20-1', name: 'Buffalo Wings', description: 'Spicy buffalo wings', price: 9.50 },
      { id: '20-2', name: 'Classic Burger', description: 'Juicy classic burger', price: 7.00 },
    ],
  },
  {
    id: '21',
    name: 'Brothers',
    description: 'Great Wings and Calzones.',
    image: 'https://picsum.photos/seed/brothers/600/400',
    deliveryFee: 4.00,
    menu: [
      { id: '21-1', name: 'Garlic Parmesan Wings', description: 'Savory wings', price: 9.25 },
      { id: '21-2', name: 'Pepperoni Calzone', description: 'Folded pizza with pepperoni', price: 10.00 },
    ],
  },
  {
    id: '22',
    name: 'Buffalo wings',
    description: 'Specializing in authentic Buffalo wings.',
    image: 'https://picsum.photos/seed/buffalowings/600/400',
    deliveryFee: 5.25,
    menu: [
      { id: '22-1', name: 'Original Buffalo Wings', description: 'Classic and spicy', price: 10.00 },
    ],
  },
  {
    id: '23',
    name: 'Abu hatem',
    description: 'Traditional grills with authentic taste.',
    image: 'https://picsum.photos/seed/abuhatem/600/400',
    deliveryFee: 6.00,
    menu: [
      { id: '23-1', name: 'Mixed Grill', description: '1kg of mixed grills', price: 20.00 },
    ],
  },
  {
    id: '24',
    name: 'Sukaryeh',
    description: 'Sweet and savory grills.',
    image: 'https://picsum.photos/seed/sukaryeh/600/400',
    deliveryFee: 5.00,
    menu: [
      { id: '24-1', name: 'Shish Tawook', description: 'Marinated chicken skewers', price: 8.00 },
    ],
  },
  {
    id: '25',
    name: 'Shweky',
    description: 'Your destination for grilled food.',
    image: 'https://picsum.photos/seed/shweky/600/400',
    deliveryFee: 4.50,
    menu: [
      { id: '25-1', name: 'Kebab', description: 'Minced meat skewers', price: 9.00 },
    ],
  },
  {
    id: '26',
    name: 'Abu el3abed',
    description: 'Hearty and delicious grills.',
    image: 'https://picsum.photos/seed/abuelabed/600/400',
    deliveryFee: 5.50,
    menu: [
      { id: '26-1', name: 'Lamb Chops', description: 'Grilled lamb chops', price: 18.00 },
    ],
  },
  {
    id: '27',
    name: 'manqal',
    description: 'Grills straight from the charcoal grill.',
    image: 'https://picsum.photos/seed/manqal/600/400',
    deliveryFee: 5.00,
    menu: [
      { id: '27-1', name: 'Arayes', description: 'Grilled pita bread stuffed with minced meat', price: 7.00 },
    ],
  },
  {
    id: '28',
    name: 'Haboob',
    description: 'Grills that will blow you away.',
    image: 'https://picsum.photos/seed/haboob/600/400',
    deliveryFee: 4.75,
    menu: [
      { id: '28-1', name: 'Chicken Kebab', description: 'Grilled chicken skewers', price: 8.50 },
    ],
  },
  {
    id: '29',
    name: 'Burgerizz',
    description: 'Juicy and flavorful burgers.',
    image: 'https://picsum.photos/seed/burgerizz/600/400',
    deliveryFee: 4.00,
    menu: [
      { id: '29-1', name: 'Classic Burger', description: 'The original Burgerizz burger', price: 6.00 },
    ],
  },
  {
    id: '30',
    name: 'X Burger',
    description: 'Extreme burgers for extreme appetites.',
    image: 'https://picsum.photos/seed/xburger/600/400',
    deliveryFee: 4.25,
    menu: [
      { id: '30-1', name: 'Double X Burger', description: 'Double patty, double cheese', price: 8.50 },
    ],
  },
  {
    id: '31',
    name: 'MO',
    description: 'Simple, yet delicious burgers.',
    image: 'https://picsum.photos/seed/mo/600/400',
    deliveryFee: 3.50,
    menu: [
      { id: '31-1', name: 'MO Burger', description: 'Signature MO burger', price: 5.50 },
    ],
  },
  {
    id: '32',
    name: 'Firefly',
    description: 'Burgers that light up your taste buds.',
    image: 'https://picsum.photos/seed/firefly/600/400',
    deliveryFee: 5.00,
    menu: [
      { id: '32-1', name: 'Firefly Burger', description: 'Spicy and juicy', price: 7.50 },
    ],
  },
  {
    id: '33',
    name: 'Black Stack',
    description: 'Stacked burgers with premium ingredients.',
    image: 'https://picsum.photos/seed/blackstack/600/400',
    deliveryFee: 5.50,
    menu: [
      { id: '33-1', name: 'Black Stack Burger', description: 'Triple stack burger', price: 10.00 },
    ],
  },
  {
    id: '34',
    name: 'MLT',
    description: 'More than just a burger.',
    image: 'https://picsum.photos/seed/mlt/600/400',
    deliveryFee: 4.00,
    menu: [
      { id: '34-1', name: 'MLT Special', description: 'Mushroom, lettuce, tomato burger', price: 7.00 },
    ],
  },
  {
    id: '35',
    name: 'Hash Burger',
    description: 'Unique burgers with a hash brown twist.',
    image: 'https://picsum.photos/seed/hashburger/600/400',
    deliveryFee: 4.50,
    menu: [
      { id: '35-1', name: 'The Hash Burger', description: 'Burger with a crispy hash brown', price: 8.00 },
    ],
  },
  {
    id: '36',
    name: 'Meat and Cheese',
    description: 'Simply meat and cheese, done right.',
    image: 'https://picsum.photos/seed/meatandcheese/600/400',
    deliveryFee: 5.00,
    menu: [
      { id: '36-1', name: 'Meat and Cheese Burger', description: 'Pure and simple', price: 6.50 },
    ],
  },
  {
    id: '37',
    name: 'Pizza Turtels',
    description: 'Heroic pizzas for everyone.',
    image: 'https://picsum.photos/seed/pizzaturtels/600/400',
    deliveryFee: 4.00,
    menu: [
      { id: '37-1', name: 'Pepperoni Pizza', description: 'A classic favorite', price: 11.00 },
    ],
  },
  {
    id: '38',
    name: 'Oliva',
    description: 'Gourmet pizzas with an olive oil base.',
    image: 'https://picsum.photos/seed/oliva/600/400',
    deliveryFee: 5.00,
    menu: [
      { id: '38-1', name: 'Margherita Pizza', description: 'Fresh and authentic', price: 12.00 },
    ],
  },
  {
    id: '39',
    name: 'Pizza maker',
    description: 'Craft your own pizza masterpiece.',
    image: 'https://picsum.photos/seed/pizzamaker/600/400',
    deliveryFee: 4.50,
    menu: [
      { id: '39-1', name: 'Custom Pizza', description: 'Choose your toppings', price: 14.00 },
    ],
  },
  {
    id: '40',
    name: 'Pizza nina',
    description: 'Pizzas made with love.',
    image: 'https://picsum.photos/seed/pizzanina/600/400',
    deliveryFee: 4.00,
    menu: [
      { id: '40-1', name: 'Veggie Pizza', description: 'Loaded with fresh vegetables', price: 10.00 },
    ],
  },
  {
    id: '41',
    name: 'Nejmeh',
    description: 'Star of oriental sweets.',
    image: 'https://picsum.photos/seed/nejmeh/600/400',
    deliveryFee: 3.00,
    menu: [
      { id: '41-1', name: 'Kunafa', description: 'Cheesy and sweet pastry', price: 5.00 },
    ],
  },
  {
    id: '42',
    name: 'Habeeba',
    description: 'The most beloved sweets in town.',
    image: 'https://picsum.photos/seed/habeeba/600/400',
    deliveryFee: 3.50,
    menu: [
      { id: '42-1', name: 'Kunafa', description: 'Traditional sweet dessert', price: 6.00 },
    ],
  },
  {
    id: '43',
    name: 'Gerarrd',
    description: 'Exquisite sweets and desserts.',
    image: 'https://picsum.photos/seed/gerarrd/600/400',
    deliveryFee: 5.00,
    menu: [
      { id: '43-1', name: 'Chocolate Cake', description: 'Rich and decadent', price: 7.00 },
    ],
  },
  {
    id: '44',
    name: 'Four winter',
    description: 'Sweets for all seasons.',
    image: 'https://picsum.photos/seed/fourwinter/600/400',
    deliveryFee: 4.00,
    menu: [
      { id: '44-1', name: 'Ice Cream', description: 'Variety of flavors', price: 4.00 },
    ],
  },
  {
    id: '45',
    name: 'Marmalade',
    description: 'Sweet treats and delicious marmalades.',
    image: 'https://picsum.photos/seed/marmalade/600/400',
    deliveryFee: 3.75,
    menu: [
      { id: '45-1', name: 'Cheesecake', description: 'Creamy cheesecake with fruit topping', price: 6.50 },
    ],
  },
  {
    id: '46',
    name: 'M7ameed',
    description: 'The best Mansaf in town.',
    image: 'https://picsum.photos/seed/m7ameed/600/400',
    deliveryFee: 8.00,
    menu: [
      { id: '46-1', name: 'Mansaf', description: 'Traditional Jordanian dish', price: 15.00 },
    ],
  },
  {
    id: '47',
    name: 'المحيط',
    description: 'Fresh catches from the ocean.',
    image: 'https://picsum.photos/seed/ocean/600/400',
    deliveryFee: 7.00,
    menu: [
      { id: '47-1', name: 'Grilled Fish', description: 'Freshly grilled fish of the day', price: 18.00 },
    ],
  },
  {
    id: '48',
    name: 'The fish and chippy',
    description: 'Classic British fish and chips.',
    image: 'https://picsum.photos/seed/fishandchippy/600/400',
    deliveryFee: 6.00,
    menu: [
      { id: '48-1', name: 'Fish and Chips', description: 'Battered fish with fries', price: 12.00 },
    ],
  }
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
                items: [{ dish: {id: '1-1', name: 'Shawerma', description: 'Classic shawerma wrap', price: 3.50}, quantity: 2 }],
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
