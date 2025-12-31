import { Recommendation } from '@/types';

// Recommendations with local image placeholders - images should be added to /public/uploads/recommendations/
export const recommendations: Recommendation[] = [
  // Food & Drinks
  {
    type: 'food',
    name: 'Kabana rooftop Food & cocktails',
    nameFr: 'Kabana rooftop Food & cocktails',
    description: 'Vibrant rooftop close to the medina with creative cocktails, great food and stunning Koutoubia views.',
    descriptionFr: 'Terrasse animée près de la médina avec des cocktails créatifs, une excellente cuisine et une vue imprenable sur la Koutoubia.',
    location: 'https://maps.google.com/?q=Kabana+Rooftop,+Marrakech,+Morocco',
    priceRange: '€€€',
    photo: '/uploads/recommendations/kabana-rooftop.jpeg',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Kabana+Rooftop,+Marrakech,+Morocco&output=embed',
    phone: '+212 664-464450'
  },
  {
    type: 'food',
    name: 'La Cantine des Gazelles',
    nameFr: 'La Cantine des Gazelles',
    description: 'Cozy Medina eatery blending authentic Moroccan dishes with international flavors. Highly recommended but book a few days in advance to secure your spot!',
    descriptionFr: 'Restaurant cosy dans la médina mélangeant des plats marocains authentiques avec des saveurs internationales. Très recommandé mais réservez quelques jours à l\'avance pour garantir votre place !',
    location: 'https://maps.google.com/?q=La+Cantine+des+Gazelles,+Marrakech,+Morocco',
    priceRange: '€',
    photo: '/uploads/recommendations/la_cantine_des_gazelles.jpg',
    mapEmbedUrl: 'https://maps.google.com/maps?q=La+Cantine+des+Gazelles,+Marrakech,+Morocco&output=embed',
    phone: '+212 624-061452'
  },
  {
    type: 'food',
    name: 'Chez Zaza',
    nameFr: 'Chez Zaza',
    description: 'Traditional Moroccon cuisine in the heart of the medina! Delicious and authentic!',
    descriptionFr: 'Cuisine marocaine traditionnelle au cœur de la médina ! Délicieux et authentique !',
    location: 'https://maps.google.com/maps?q=Chez+Zaza,+Marrakech,+Morocco',
    priceRange: '€€',
    photo: '/uploads/recommendations/chez_zaza.webp',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Chez+Zaza,+Marrakech,+Morocco&output=embed',
    phone: '+212 5244-28291'
  },
  {
    type: 'food',
    name: 'Patisserie corne de gazelle chez Brahim',
    nameFr: 'Pâtisserie corne de gazelle chez Brahim',
    description: 'Renowned pastry shop with exquisite Moroccan pastries & sweets. Go there to bring back some nice treats!',
    descriptionFr: 'Pâtisserie renommée avec d\'exquises pâtisseries et sucreries marocaines. Allez-y pour rapporter de délicieuses friandises !',
    location: 'https://maps.google.com/?q=Patisserie+Corne+De+Gazelle+Chez+Brahim,+Marrakech,+Morocco',
    priceRange: '€',
    photo: '/uploads/recommendations/patisserie.webp',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Patisserie+Corne+De+Gazelle+Chez+Brahim,+Marrakech,+Morocco&output=embed',
    phone: '+212 524-442345'
  },
  {
    type: 'food',
    name: 'La Terrasse des Epices - Marrakech',
    nameFr: 'La Terrasse des Epices - Marrakech',
    description: 'Beautiful rooftop restaurant offering Moroccan and Mediterranean cuisine with stunning views of the medina.',
    descriptionFr: 'Magnifique restaurant en terrasse offrant une cuisine marocaine et méditerranéenne avec une vue imprenable sur la médina.',
    location: 'https://maps.google.com/?q=La+Terrasse+des+Epices,+Marrakech,+Morocco',
    priceRange: '€€€',
    photo: '/uploads/recommendations/terrasse-epices.webp',
    mapEmbedUrl: 'https://maps.google.com/maps?q=La+Terrasse+des+Epices,+Marrakech,+Morocco&output=embed',
    phone: '+212 5243-75904'
  },
  
  // Relax
  {
    type: 'relax',
    name: 'Isis Spa Marrakech',
    nameFr: 'Isis Spa Marrakech',
    description: 'Serene spa offering traditional hammam, massages, and beauty treatments. Book over whatsapp a day or two before',
    descriptionFr: 'Spa serein offrant hammam traditionnel, massages et soins de beauté. Réservez par WhatsApp un jour ou deux à l\'avance',
    location: 'https://maps.google.com/?q=ISIS+SPA+Marrakech,+Morocco',
    priceRange: '€€',
    photo: '/uploads/recommendations/isis_spa.jpg',
    mapEmbedUrl: 'https://maps.google.com/maps?q=ISIS+SPA+Marrakech,+Morocco&output=embed',
    phone: '+212 637-276627',
    whatsapp: true
  },
  {
    type: 'relax',
    name: 'Hotel manzil la tortue',
    nameFr: 'Hôtel Manzil la Tortue',
    description: 'Amazing hotel outside of Marrakech where you can spend a few hours or the day (350dh/pers with lunch provided without transport). Ask the hotel, they should be able to arrange the transport.',
    descriptionFr: 'Hôtel incroyable en dehors de Marrakech où vous pouvez passer quelques heures ou la journée (350dh/pers avec déjeuner fourni sans transport). Demandez à l\'hôtel, ils devraient pouvoir organiser le transport.',
    location: 'https://maps.google.com/?q=SpaManzil+La+Tortue,+Marrakech,+Morocco',
    priceRange: '€€€',
    photo: '/uploads/recommendations/spa-manzil-la-tortue.jpg',
    mapEmbedUrl: 'https://maps.google.com/maps?q=SpaManzil+La+Tortue,+Marrakech,+Morocco&output=embed',
    phone: '+212 661-955517'
  },
  {
    type: 'relax',
    name: 'Mamounia Palace Hotel',
    nameFr: 'Hôtel Mamounia Palace',
    description: 'Iconic luxury hotel in Marrakech. Tips: go grab a mint tea there for cheap and enjoy the place. Call them as they have specific timing and you must dress properly, otherwise they may not allow you inside.',
    descriptionFr: 'Hôtel de luxe emblématique à Marrakech. Conseils : allez prendre un thé à la menthe là-bas pour pas cher et profitez de l\'endroit. Appelez-les car ils ont des horaires spécifiques et vous devez vous habiller correctement, sinon ils pourraient ne pas vous laisser entrer.',
    location: 'https://maps.google.com/?q=La+Mamounia,+Marrakech,+Morocco',
    priceRange: '€€',
    photo: '/uploads/recommendations/mamounia.jpeg',
    mapEmbedUrl: 'https://maps.google.com/maps?q=La+Mamounia,+Marrakech,+Morocco&output=embed',
    phone: '+212 5243-88600'
  },
  
  // Museum
  {
    type: 'museum',
    name: 'Jardin Majorelle',
    nameFr: 'Jardin Majorelle',
    description: 'Stunning botanical garden with exotic plants and iconic cobalt blue architecture. Highly recommended to visit!',
    descriptionFr: 'Jardin botanique époustouflant avec des plantes exotiques et une architecture bleu cobalt emblématique. Très recommandé de visiter !',
    location: 'https://maps.google.com/?q=Jardin+Majorelle,+Marrakech,+Morocco',
    priceRange: '€€',
    photo: '/uploads/recommendations/majorelle.jpg',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Jardin+Majorelle,+Marrakech,+Morocco&output=embed',
    phone: '+212 5242-98686'
  },
  {
    type: 'museum',
    name: 'Mouassine Museum',
    nameFr: 'Musée Mouassine',
    description: 'Historic museum showcasing traditional Moroccan architecture and culture in the heart of the medina.',
    descriptionFr: 'Musée historique présentant l\'architecture et la culture marocaines traditionnelles au cœur de la médina.',
    location: 'https://maps.google.com/?q=Mouassine+Museum,+Marrakech,+Morocco',
    priceRange: '€€',
    photo: '/uploads/recommendations/mouassine-museum.webp',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Mouassine+Museum,+Marrakech,+Morocco&output=embed',
    phone: '+212 5243-77792'
  },
  
  // Local Vibes
  {
    type: 'local',
    name: 'Place Jamaa el-Fna',
    nameFr: 'Place Jamaa el-Fna',
    description: 'UNESCO-listed square with street performers, storytellers, and vibrant food stalls. Quite touristic but worth it!',
    descriptionFr: 'Place classée UNESCO avec des artistes de rue, des conteurs et des stands de nourriture animés. Assez touristique mais ça vaut le coup !',
    location: 'https://maps.google.com/?q=Place+Jemaa+el-Fna,+Marrakech,+Morocco',
    photo: '/uploads/recommendations/place_jamaa.jpg',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Place+Jemaa+el-Fna,+Marrakech,+Morocco&output=embed'
  },
  {
    type: 'local',
    name: 'Medina & Souk',
    nameFr: 'Médina & Souk',
    description: 'Historic maze of alleyways with vibrant souks selling spices, textiles, and crafts. Always negociate at least half price!',
    descriptionFr: 'Labyrinthe historique d\'allées avec des souks animés vendant des épices, des textiles et de l\'artisanat. Négociez toujours au moins la moitié du prix !',
    location: 'https://maps.google.com/?q=Marrakech+Medina,+Morocco',
    priceRange: '€',
    photo: '/uploads/recommendations/medina.jpeg',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Marrakech+Medina,+Morocco&output=embed'
  },
  {
    type: 'local',
    name: 'Secret Garden',
    nameFr: 'Jardin Secret',
    description: 'Hidden gem in the medina featuring beautiful gardens, traditional architecture, and peaceful courtyards.',
    descriptionFr: 'Joyau caché dans la médina avec de beaux jardins, une architecture traditionnelle et des cours paisibles.',
    location: 'https://www.google.com/maps/place/Le+Jardin+Secret+M%C3%A9dina+Marrakech/data=!4m2!3m1!1s0xdafee684dbf3e01:0x50d89166ad205c0c?sa=X&ved=1t:155783&ictx=111',
    priceRange: '€€',
    photo: '/uploads/recommendations/secret_garden.webp',
    mapEmbedUrl: 'https://www.google.com/maps?q=Le+Jardin+Secret+Médina+Marrakech&output=embed',
    phone: '+212 5243-90040'
  }
];


