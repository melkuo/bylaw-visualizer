export interface ActiveBylaws {
  frontSetback: boolean;
  rearSetback: boolean;
  sideSetback: boolean;
  heightRestriction: boolean;
  lotCoverage: boolean;
  buildingDepth: boolean;
}

export interface BylawParameters {
  setbacks: {
    front: number;
    rear: number;
    side: number;
  };
  heightRestriction: {
    maxHeight: number;
    mainWallHeight: number;
  };
  lotCoverage: {
    maxPercentage: number;
  };
  buildingDepth: {
    maxDepth: number;
  };
} 