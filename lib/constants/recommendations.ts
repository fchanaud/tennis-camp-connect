import { Recommendation } from '@/types';

// Recommendations with local image placeholders - images should be added to /public/uploads/recommendations/
export const recommendations: Recommendation[] = [
  // Food & Drinks
  {
    type: 'food',
    name: 'Kabana rooftop Food & cocktails',
    description: 'Vibrant rooftop close to the medina with creative cocktails, great food and stunning Koutoubia views.',
    location: 'https://maps.google.com/?q=Kabana+Rooftop,+Marrakech,+Morocco',
    priceRange: '€€€',
    photo: '/uploads/recommendations/kabana-rooftop.jpeg',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Kabana+Rooftop,+Marrakech,+Morocco&output=embed',
    phone: '+212 664-464450'
  },
  {
    type: 'food',
    name: 'La Cantine des Gazelles',
    description: 'Cozy Medina eatery blending authentic Moroccan dishes with international flavors. Highly recommended but book a few days in advance to secure your spot!',
    location: 'https://maps.google.com/?q=La+Cantine+des+Gazelles,+Marrakech,+Morocco',
    priceRange: '€',
    photo: '/uploads/recommendations/la_cantine_des_gazelles.jpg',
    mapEmbedUrl: 'https://maps.google.com/maps?q=La+Cantine+des+Gazelles,+Marrakech,+Morocco&output=embed',
    phone: '+212 624-061452'
  },
  {
    type: 'food',
    name: 'Chez Zaza',
    description: 'Traditional Moroccon cuisine in the heart of the medina! Delicious and authentic!',
    location: 'https://maps.google.com/maps?q=Chez+Zaza,+Marrakech,+Morocco',
    priceRange: '€€',
    photo: '/uploads/recommendations/chez_zaza.webp',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Chez+Zaza,+Marrakech,+Morocco&output=embed',
    phone: '+212 5244-28291'
  },
  {
    type: 'food',
    name: 'Patisserie corne de gazelle chez Brahim',
    description: 'Renowned pastry shop with exquisite Moroccan pastries & sweets. Go there to bring back some nice treats!',
    location: 'https://maps.google.com/?q=Patisserie+Corne+De+Gazelle+Chez+Brahim,+Marrakech,+Morocco',
    priceRange: '€',
    photo: '/uploads/recommendations/patisserie.webp',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Patisserie+Corne+De+Gazelle+Chez+Brahim,+Marrakech,+Morocco&output=embed',
    phone: '+212 524-442345'
  },
  
  // Relax
  {
    type: 'relax',
    name: 'Isis Spa Marrakech',
    description: 'Serene spa offering traditional hammam, massages, and beauty treatments. Book over whatsapp a day or two before',
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
    description: 'Amazing hotel outside of Marrakech where you can spend a few hours or the day (350dh/pers with lunch provided without transport). Ask the hotel, they should be able to arrange the transport.',
    location: 'https://maps.google.com/?q=SpaManzil+La+Tortue,+Marrakech,+Morocco',
    priceRange: '€€€',
    photo: '/uploads/recommendations/spa-manzil-la-tortue.jpg',
    mapEmbedUrl: 'https://maps.google.com/maps?q=SpaManzil+La+Tortue,+Marrakech,+Morocco&output=embed',
    phone: '+212 661-955517'
  },
  {
    type: 'relax',
    name: 'Mamounia Palace Hotel',
    description: 'Iconic luxury hotel in Marrakech. Tips: go grab a mint tea there for cheap and enjoy the place. Call them as they have specific timing and you must dress properly, otherwise they may not allow you inside.',
    location: 'https://maps.google.com/?q=La+Mamounia,+Marrakech,+Morocco',
    priceRange: '€€',
    photo: '/uploads/recommendations/mamounia.jpeg',
    mapEmbedUrl: 'https://maps.google.com/maps?q=La+Mamounia,+Marrakech,+Morocco&output=embed',
    phone: '+212 5243-88600'
  },
  
  // Local Vibes
  {
    type: 'local',
    name: 'Jardin Majorelle',
    description: 'Stunning botanical garden with exotic plants and iconic cobalt blue architecture. Highly recommended to visit!',
    location: 'https://maps.google.com/?q=Jardin+Majorelle,+Marrakech,+Morocco',
    priceRange: '€€',
    photo: '/uploads/recommendations/majorelle.jpg',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Jardin+Majorelle,+Marrakech,+Morocco&output=embed',
    phone: '+212 5242-98686'
  },
  {
    type: 'local',
    name: 'Place Jamaa el-Fna',
    description: 'UNESCO-listed square with street performers, storytellers, and vibrant food stalls. Quite touristic but worth it!',
    location: 'https://maps.google.com/?q=Place+Jemaa+el-Fna,+Marrakech,+Morocco',
    photo: '/uploads/recommendations/place_jamaa.jpg',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Place+Jemaa+el-Fna,+Marrakech,+Morocco&output=embed'
  },
  {
    type: 'local',
    name: 'Medina & Souk',
    description: 'Historic maze of alleyways with vibrant souks selling spices, textiles, and crafts. Always negociate at least half price!',
    location: 'https://maps.google.com/?q=Marrakech+Medina,+Morocco',
    priceRange: '€',
    photo: '/uploads/recommendations/medina.jpeg',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Marrakech+Medina,+Morocco&output=embed'
  }
];


