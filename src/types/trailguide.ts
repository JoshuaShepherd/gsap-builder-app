// Faith Pulse Map Types
export interface FaithInstitution {
  id: string;
  name: string;
  coordinates: [number, number];
  foundedYear: number;
  denomination: string;
  congregation: {
    size: number;
    demographics: {
      ageGroups: Record<string, number>;
      ethnicities: Record<string, number>;
      avgAge: number;
      percentLocal: number;
      percentMultiGenerational: number;
    };
  };
  programs: Array<{
    type: string;
    name: string;
    participantCount: number;
    reach: number;
    impact: number;
  }>;
  intensity?: number;
  strength?: number;
  rippleEffect: {
    directImpact: number;
    networkImpact: number;
    economicImpact: number;
  };
}

export interface FaithPulseMapProps {
  churches: FaithInstitution[];
  radiiData: Array<{
    churchId: string;
    programs: Array<{
      type: string;
      radius: number;
      intensity: number;
    }>;
  }>;
  overlays?: any;
  narrativeMode?: 'integrated' | 'separate';
  showStories?: boolean;
  exportMode?: 'web' | 'print';
  onChurchSelect?: (church: FaithInstitution) => void;
}

// Neighborhood Split Map Types
export interface DemographicZone {
  id: string;
  name: string;
  coordinates: Array<[number, number]>;
  dominantTheme: 'legacy' | 'newcomer' | 'transition' | 'tension';
  demographics: {
    legacy: number;
    newcomer: number;
    total: number;
    totalPopulation: number;
    income: {
      median: number;
    };
    housing: {
      averageYearsResident: number;
      owned: number;
    };
  };
  tensionMetrics: {
    priceChangePercent: number;
    turnoverRate: number;
    newConstructionCount: number;
  };
}

export interface StoryQuote {
  id: string;
  text: string;
  author: string;
  coordinates?: [number, number];
  zoneId: string;
  speaker: string;
  role: string;
  quote: string;
  context: string;
}

export interface NeighborhoodSplitMapProps {
  data: DemographicZone[];
  flowData: Array<{
    fromZone: string;
    toZone: string;
    intensity: number;
    type: 'migration' | 'influence' | 'conflict';
  }>;
  quotes: StoryQuote[];
  viewMode: 'demographics' | 'themes' | 'flows';
  highlights?: any;
  centerLabel?: string;
  annotations?: any;
  narrativeMode?: 'integrated' | 'separate';
  showStories?: boolean;
  exportMode?: 'web' | 'print';
  onZoneSelect?: (zone: DemographicZone) => void;
  onQuoteSelect?: (quote: StoryQuote) => void;
}

// Neighborhood Timeline Types
export interface TimelineEvent {
  id: string;
  year: number;
  label: string;
  description: string;
  eventType: 'development' | 'community' | 'economic' | 'resistance' | 'celebration';
  impact: 'low' | 'medium' | 'high';
  coordinates?: [number, number];
  story?: string;
  affectedPopulation: number;
}

export interface AnnualStats {
  year: number;
  population: {
    total: number;
    legacy: number;
    newcomer: number;
  };
  homeValues: {
    median: number;
    appreciation: number;
    percentChange: number;
  };
  businessCount: number;
  rentPrices: {
    median: number;
  };
  displacement: {
    netChange: number;
    familiesLeaving: number;
    newcomersArriving: number;
  };
}

export interface NeighborhoodTimelineProps {
  events: TimelineEvent[];
  annualStats: AnnualStats[];
  focusYears?: number[];
  narratives?: any;
  timeRange?: [number, number];
  narrativeMode?: 'integrated' | 'separate';
  showStories?: boolean;
  onEventSelect?: (event: TimelineEvent) => void;
  onYearSelect?: (year: number) => void;
}
