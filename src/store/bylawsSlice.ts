import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActiveBylaws, BylawParameters } from '../types/bylaws';

interface BylawsState {
  active: ActiveBylaws;
  parameters: BylawParameters;
}

// Toronto Zoning By-law 569-2013 measurements for 225m² lot
const initialState: BylawsState = {
  active: {
    frontSetback: false,
    rearSetback: false,
    sideSetback: false,
    heightRestriction: false,
    lotCoverage: false,
    buildingDepth: false,
  },
  parameters: {
    setbacks: {
      front: 5.0,
      rear: 7.5,
      side: 0.9,
    },
    heightRestriction: {
      maxHeight: 10,
      mainWallHeight: 7,
    },
    lotCoverage: {
      maxPercentage: 40,
    },
    buildingDepth: {
      maxDepth: 17,
    },
  },
};

const bylawsSlice = createSlice({
  name: 'bylaws',
  initialState,
  reducers: {
    toggleBylaw: (state, action: PayloadAction<keyof ActiveBylaws>) => {
      state.active[action.payload] = !state.active[action.payload];
    },
  },
});

export const { toggleBylaw } = bylawsSlice.actions;
export default bylawsSlice.reducer; 