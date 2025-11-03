import { Recommendation } from '@/types';

// Recommendations with local image placeholders - images should be added to /public/uploads/recommendations/
export const recommendations: Recommendation[] = [
  // Food & Drinks
  {
    type: 'food',
    name: 'KABANA ROOFTOP FOOD & COCKTAILS',
    description: 'Vibrant rooftop with Mediterranean fusion, creative cocktails, and stunning Koutoubia views.',
    location: 'https://maps.google.com/?q=Kabana+Rooftop,+Marrakech,+Morocco',
    priceRange: '€€',
    photo: '/uploads/recommendations/kabana-rooftop.jpg',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Kabana+Rooftop,+Marrakech,+Morocco&output=embed'
  },
  {
    type: 'food',
    name: 'La Cantine des Gazelles',
    description: 'Cozy Medina eatery blending authentic Moroccan dishes with international flavors.',
    location: 'https://maps.google.com/?q=La+Cantine+des+Gazelles,+Marrakech,+Morocco',
    priceRange: '€€',
    photo: '/uploads/recommendations/la-cantine-des-gazelles.jpg',
    mapEmbedUrl: 'https://maps.google.com/maps?q=La+Cantine+des+Gazelles,+Marrakech,+Morocco&output=embed'
  },
  {
    type: 'food',
    name: 'Patisserie des Princes',
    description: 'Renowned pastry shop with exquisite Moroccan sweets and French pastries.',
    location: 'https://maps.google.com/?q=Patisserie+des+Princes,+Marrakech,+Morocco',
    priceRange: '€',
    photo: '/uploads/recommendations/patisserie-des-princes.jpg',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Patisserie+des+Princes,+Marrakech,+Morocco&output=embed'
  },
  
  // Relax
  {
    type: 'relax',
    name: 'ISIS SPA Marrakech',
    description: 'Serene spa offering traditional hammam, massages, and beauty treatments.',
    location: 'https://maps.google.com/?q=ISIS+SPA+Marrakech,+Morocco',
    priceRange: '€€',
    photo: '/uploads/recommendations/isis-spa.jpg',
    mapEmbedUrl: 'https://maps.google.com/maps?q=ISIS+SPA+Marrakech,+Morocco&output=embed'
  },
  {
    type: 'relax',
    name: 'SpaManzil La Tortue',
    description: 'Luxurious spa in lush gardens with premium wellness treatments and hammam rituals.',
    location: 'https://maps.google.com/?q=SpaManzil+La+Tortue,+Marrakech,+Morocco',
    priceRange: '€€€',
    photo: '/uploads/recommendations/spamanzil-la-tortue.jpg',
    mapEmbedUrl: 'https://maps.google.com/maps?q=SpaManzil+La+Tortue,+Marrakech,+Morocco&output=embed'
  },
  {
    type: 'relax',
    name: 'Mamounia Palace Hotel',
    description: 'Iconic luxury hotel with world-class spa, opulent hammams, and stunning pools.',
    location: 'https://maps.google.com/?q=La+Mamounia,+Marrakech,+Morocco',
    priceRange: '€€€',
    photo: '/uploads/recommendations/mamounia-palace.jpg',
    mapEmbedUrl: 'https://maps.google.com/maps?q=La+Mamounia,+Marrakech,+Morocco&output=embed'
  },
  
  // Culture
  {
    type: 'culture',
    name: 'Jardin Majorelle',
    description: 'Stunning botanical garden with exotic plants and iconic cobalt blue architecture.',
    location: 'https://maps.google.com/?q=Jardin+Majorelle,+Marrakech,+Morocco',
    priceRange: '€',
    photo: '/uploads/recommendations/jardin-majorelle.jpg',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Jardin+Majorelle,+Marrakech,+Morocco&output=embed'
  },
  {
    type: 'culture',
    name: 'Musée Yves Saint Laurent',
    description: 'Museum showcasing the legendary designer\'s iconic creations and fashion history.',
    location: 'https://maps.google.com/?q=Musée+Yves+Saint+Laurent,+Marrakech,+Morocco',
    priceRange: '€€',
    photo: '/uploads/recommendations/musee-ysl.jpg',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Musée+Yves+Saint+Laurent,+Marrakech,+Morocco&output=embed'
  },
  
  // Local Vibes
  {
    type: 'local',
    name: 'Place Jamaa el-Fna',
    description: 'UNESCO-listed square with street performers, storytellers, and vibrant food stalls.',
    location: 'https://maps.google.com/?q=Place+Jemaa+el-Fna,+Marrakech,+Morocco',
    priceRange: '€',
    photo: '/uploads/recommendations/place-jamaa-el-fna.jpg',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Place+Jemaa+el-Fna,+Marrakech,+Morocco&output=embed'
  },
  {
    type: 'local',
    name: 'Medina and Souk',
    description: 'Historic maze of alleyways with vibrant souks selling spices, textiles, and crafts.',
    location: 'https://maps.google.com/?q=Marrakech+Medina,+Morocco',
    priceRange: '€',
    photo: '/uploads/recommendations/medina-souk.jpg',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Marrakech+Medina,+Morocco&output=embed'
  }
];


