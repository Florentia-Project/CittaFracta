import React from 'react';
import { Family } from '../../../types';
import GeographicalMap from '../GeographicalMap';

interface CityMapViewProps {
  data: Family[];
  onSelectFamily: (family: Family | null) => void;
  selectedFamilyId?: string;
  currentYear: number;
  onYearChange: (year: number) => void;
}

export const CityMapView: React.FC<CityMapViewProps> = ({
  data,
  onSelectFamily,
  selectedFamilyId,
  currentYear,
  onYearChange,
}) => {
  return (
    <div className="h-full w-full relative z-10">
      <GeographicalMap
        data={data}
        onSelectFamily={onSelectFamily}
        selectedFamilyId={selectedFamilyId}
        year={currentYear}
        onYearChange={onYearChange}
      />
    </div>
  );
};
