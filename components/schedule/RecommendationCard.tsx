import React from 'react';
import { Card, CardBody, CardTitle, CardText } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Recommendation } from '@/types';
import { MapPin } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const typeColors = {
  food: '#FF4C4C',
  relax: '#66B032',
  excursion: '#FF7F2A',
};

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const { type, name, description, location, priceRange } = recommendation;
  
  return (
    <Card hover className="h-full">
      <CardBody>
        <div className="flex justify-between items-start mb-3">
          <Badge
            variant="primary"
            style={{ backgroundColor: typeColors[type] }}
            className="capitalize"
          >
            {type}
          </Badge>
          <span className="text-gray-600 font-semibold">{priceRange}</span>
        </div>
        
        <CardTitle className="mb-2">{name}</CardTitle>
        <CardText className="mb-4">{description}</CardText>
        
        <a
          href={location}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[#2563EB] hover:underline text-sm"
        >
          <MapPin className="w-4 h-4" />
          View on Google Maps
        </a>
      </CardBody>
    </Card>
  );
}

