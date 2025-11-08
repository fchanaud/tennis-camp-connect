'use client';

import React from 'react';
import { Card, CardBody, CardTitle, CardText } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Recommendation } from '@/types';
import { MapPin, ExternalLink, Phone, MessageCircle } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const typeColors = {
  food: '#FF4C4C',
  relax: '#66B032',
  culture: '#FF7F2A',
  local: '#9B59B6',
};

const typeLabels = {
  food: 'Food & Drinks',
  relax: 'Relax',
  culture: 'Culture',
  local: 'Local Vibes',
};

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const { type, name, description, location, priceRange, photo, phone, whatsapp } = recommendation;
  const defaultImage = '/uploads/recommendations/default.svg';
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    // Prevent infinite loop - only set if not already the default image
    if (!target.src.includes('default.svg')) {
      target.src = defaultImage;
    }
  };
  
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      {/* Photo */}
      <div className="relative w-full h-72 sm:h-64 md:h-64 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
        <img
          src={photo}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 z-10">
          <Badge
            variant="primary"
            style={{ backgroundColor: typeColors[type] }}
            className="capitalize text-white shadow-lg text-xs sm:text-sm px-2.5 py-1"
          >
            {typeLabels[type]}
          </Badge>
        </div>
        {priceRange && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-gray-800 font-semibold text-xs sm:text-sm shadow-lg">
              {priceRange}
            </span>
          </div>
        )}
      </div>

      <CardBody className="flex-1 flex flex-col p-4 sm:p-5">
        <CardTitle className="mb-2 text-lg sm:text-xl font-bold text-gray-900 leading-tight">
          {name}
        </CardTitle>
        <CardText className="mb-4 text-sm sm:text-base text-gray-600 flex-1 leading-relaxed">
          {description}
        </CardText>
        
        {/* Phone Number */}
        {phone && (
          <div className="mb-3 flex items-center gap-2 text-sm sm:text-base text-gray-700">
            {whatsapp ? (
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-gray-600" />
            ) : (
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-gray-600" />
            )}
            <a 
              href={whatsapp 
                ? `https://wa.me/${phone.replace(/[\s+-]/g, '')}` 
                : `tel:${phone.replace(/\s/g, '')}`
              }
              className="text-[#2563EB] hover:text-[#1e40af] hover:underline transition-colors"
              target={whatsapp ? "_blank" : undefined}
              rel={whatsapp ? "noopener noreferrer" : undefined}
            >
              {phone}
            </a>
          </div>
        )}
        
        {/* Google Maps Link */}
        <a
          href={location}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex items-center justify-center gap-2 w-full bg-[#2563EB] hover:bg-[#1e40af] text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
        >
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <span>View on Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
        </a>
      </CardBody>
    </Card>
  );
}

