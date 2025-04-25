import { useRef, useMemo } from 'react';
import { Mesh, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { Text, Line } from '@react-three/drei';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { ActiveBylaws } from '../types/bylaws';

interface BuildingProps {
  activeBylaws: ActiveBylaws;
}

// Real-world measurements in meters
const LOT_WIDTH = 7.5; // 7.5m wide
const LOT_DEPTH = 30; // 30m deep
const LOT_AREA = 225; // 225m² total lot area

// Bylaw requirements
const FRONT_SETBACK = 5; // meters - updated from 0.9m to 5m
const SIDE_SETBACK = 0.9; // meters
const REAR_SETBACK = Math.max(7.5, LOT_DEPTH * 0.25); // 7.5m or 25% of lot depth, whichever is greater
const MAX_HEIGHT = 10; // meters
const MAIN_WALL_HEIGHT = 7; // meters
const BUILDING_DEPTH = 17; // meters
const MAX_LOT_COVERAGE = 0.4; // 40%

// Human figure measurements
const PERSON_HEIGHT = 1.8; // meters
const PERSON_WIDTH = 0.5; // meters
const PERSON_DEPTH = 0.3; // meters

// Calculate maximum building width based on lot coverage
// For a 225m² lot with 40% coverage, max building area is 90m²
// If building depth is 17m, then max width is 90/17 ≈ 5.3m
const MAX_BUILDING_WIDTH = (LOT_AREA * MAX_LOT_COVERAGE) / BUILDING_DEPTH;

// Tree measurements
const TREE_HEIGHT = 9; // meters
const TREE_TRUNK_WIDTH = 0.2; // meters - reduced from 0.4
const TREE_CANOPY_WIDTH = 4; // meters - increased from 3
const TREE_CANOPY_HEIGHT = 6; // meters - new parameter for canopy height

// Human figure component
const HumanFigure = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      {/* Body */}
      <mesh position={[0, PERSON_HEIGHT/2, 0]}>
        <cylinderGeometry args={[PERSON_WIDTH/2, PERSON_WIDTH/2, PERSON_HEIGHT, 8]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      {/* Head */}
      <mesh position={[0, PERSON_HEIGHT + 0.2, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      {/* Legs */}
      <mesh position={[-PERSON_WIDTH/4, PERSON_HEIGHT/4, 0]}>
        <cylinderGeometry args={[0.05, 0.05, PERSON_HEIGHT/2, 8]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      <mesh position={[PERSON_WIDTH/4, PERSON_HEIGHT/4, 0]}>
        <cylinderGeometry args={[0.05, 0.05, PERSON_HEIGHT/2, 8]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
    </group>
  );
};

// Tree component
const Tree = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, TREE_HEIGHT/2, 0]}>
        <cylinderGeometry args={[TREE_TRUNK_WIDTH/2, TREE_TRUNK_WIDTH/2, TREE_HEIGHT, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Main canopy */}
      <mesh position={[0, TREE_HEIGHT - TREE_CANOPY_HEIGHT/3, 0]}>
        <coneGeometry args={[TREE_CANOPY_WIDTH/2, TREE_CANOPY_HEIGHT, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
      {/* Secondary canopy layer for fuller look */}
      <mesh position={[0, TREE_HEIGHT - TREE_CANOPY_HEIGHT/2, 0]}>
        <coneGeometry args={[TREE_CANOPY_WIDTH/1.5, TREE_CANOPY_HEIGHT/1.5, 8]} />
        <meshStandardMaterial color="#32CD32" />
      </mesh>
      {/* Top canopy layer */}
      <mesh position={[0, TREE_HEIGHT - TREE_CANOPY_HEIGHT/6, 0]}>
        <coneGeometry args={[TREE_CANOPY_WIDTH/2.5, TREE_CANOPY_HEIGHT/2, 8]} />
        <meshStandardMaterial color="#90EE90" />
      </mesh>
    </group>
  );
};

export const Building = ({ activeBylaws }: BuildingProps) => {
  const buildingRef = useRef<Mesh>(null);
  const bylawParams = useSelector((state: RootState) => state.bylaws.parameters);
  
  // Debug information
  console.log('Active Bylaws:', activeBylaws);
  console.log('Bylaw Parameters:', bylawParams);

  // Calculate building dimensions based on active bylaws
  const dimensions = useMemo(() => {
    // Start with a tall building to demonstrate height restrictions
    const modified = {
      width: LOT_WIDTH,
      depth: LOT_DEPTH,
      height: 18, // Start taller than MAX_HEIGHT to show restriction
      mainWallHeight: 12, // Start taller than MAIN_WALL_HEIGHT to show restriction
      position: { x: 0, z: 0 }, // Track building position for setbacks
    };

    // Apply individual setbacks
    if (activeBylaws.frontSetback) {
      modified.depth -= FRONT_SETBACK;
      modified.position.z -= FRONT_SETBACK / 2; // Move building backward (fixed direction)
    }
    if (activeBylaws.rearSetback) {
      modified.depth -= REAR_SETBACK;
      modified.position.z += REAR_SETBACK / 2; // Move building forward (fixed direction)
    }
    if (activeBylaws.sideSetback) {
      modified.width -= 2 * SIDE_SETBACK;
    }

    // Apply lot coverage restrictions (only affects width)
    if (activeBylaws.lotCoverage) {
      modified.width = Math.min(modified.width, MAX_BUILDING_WIDTH);
    }

    // Apply building depth restriction (only affects depth)
    if (activeBylaws.buildingDepth) {
      modified.depth = Math.min(modified.depth, BUILDING_DEPTH);
    }

    // Apply height restrictions (only affects height)
    if (activeBylaws.heightRestriction) {
      modified.height = MAX_HEIGHT;
      modified.mainWallHeight = MAIN_WALL_HEIGHT;
    }

    console.log('Calculated Dimensions:', modified);
    return modified;
  }, [activeBylaws]);

  // Create measurement lines and labels
  const setbackVisuals = useMemo(() => {
    return (
      <group>
        {/* Front setback line */}
        {activeBylaws.frontSetback && (
          <Line
            points={[
              [-LOT_WIDTH/2, 0, -LOT_DEPTH/2],
              [LOT_WIDTH/2, 0, -LOT_DEPTH/2 + FRONT_SETBACK]
            ]}
            color="red"
            dashed
          />
        )}

        {/* Rear setback line */}
        {activeBylaws.rearSetback && (
          <Line
            points={[
              [-LOT_WIDTH/2, 0, LOT_DEPTH/2],
              [LOT_WIDTH/2, 0, LOT_DEPTH/2 - REAR_SETBACK]
            ]}
            color="red"
            dashed
          />
        )}

        {/* Side setback lines */}
        {activeBylaws.sideSetback && (
          <>
            <Line
              points={[
                [-LOT_WIDTH/2 + SIDE_SETBACK, 0, -LOT_DEPTH/2],
                [-LOT_WIDTH/2 + SIDE_SETBACK, 0, LOT_DEPTH/2]
              ]}
              color="red"
              dashed
            />
            <Line
              points={[
                [LOT_WIDTH/2 - SIDE_SETBACK, 0, -LOT_DEPTH/2],
                [LOT_WIDTH/2 - SIDE_SETBACK, 0, LOT_DEPTH/2]
              ]}
              color="red"
              dashed
            />
          </>
        )}

        {/* Building size reduction indicators */}
        {(activeBylaws.frontSetback || activeBylaws.rearSetback || activeBylaws.sideSetback) && (
          <Line
            points={[
              [-dimensions.width/2, 0, -dimensions.depth/2 + dimensions.position.z],
              [dimensions.width/2, 0, -dimensions.depth/2 + dimensions.position.z],
              [dimensions.width/2, 0, dimensions.depth/2 + dimensions.position.z],
              [-dimensions.width/2, 0, dimensions.depth/2 + dimensions.position.z],
              [-dimensions.width/2, 0, -dimensions.depth/2 + dimensions.position.z]
            ]}
            color="yellow"
            dashed
          />
        )}
      </group>
    );
  }, [activeBylaws, dimensions]);

  // Create height restriction visuals
  const heightVisuals = useMemo(() => {
    if (!activeBylaws.heightRestriction) return null;

    return (
      <group>
        {/* Main wall height indicator */}
        <Line
          points={[
            [-dimensions.width/2, 0, -dimensions.depth/2 + dimensions.position.z],
            [-dimensions.width/2, MAIN_WALL_HEIGHT, -dimensions.depth/2 + dimensions.position.z]
          ]}
          color="blue"
          dashed
        />

        {/* Maximum height indicator */}
        <Line
          points={[
            [-dimensions.width/2, 0, dimensions.depth/2 + dimensions.position.z],
            [-dimensions.width/2, MAX_HEIGHT, dimensions.depth/2 + dimensions.position.z]
          ]}
          color="green"
          dashed
        />
      </group>
    );
  }, [activeBylaws.heightRestriction, dimensions]);

  return (
    <group>
      {/* Lot outline */}
      <Line
        points={[
          [-LOT_WIDTH/2, 0, -LOT_DEPTH/2],
          [LOT_WIDTH/2, 0, -LOT_DEPTH/2],
          [LOT_WIDTH/2, 0, LOT_DEPTH/2],
          [-LOT_WIDTH/2, 0, LOT_DEPTH/2],
          [-LOT_WIDTH/2, 0, -LOT_DEPTH/2]
        ]}
        color="blue"
      />

      {/* Base/Ground */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[LOT_WIDTH, LOT_DEPTH]} />
        <meshStandardMaterial color="#a0a0a0" />
      </mesh>

      {/* Original building outline (when any setback is active) */}
      {(activeBylaws.frontSetback || activeBylaws.rearSetback || activeBylaws.sideSetback) && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[LOT_WIDTH, LOT_DEPTH]} />
          <meshStandardMaterial color="#ff0000" transparent opacity={0.1} />
        </mesh>
      )}

      {/* Main Building Structure */}
      <mesh 
        ref={buildingRef} 
        position={[
          dimensions.position.x, 
          dimensions.height / 2, 
          dimensions.position.z
        ]}
      >
        <boxGeometry 
          args={[dimensions.width, dimensions.height, dimensions.depth]} 
        />
        <meshStandardMaterial color="#f0d090" />
      </mesh>

      {/* Setback Visualization */}
      {setbackVisuals}

      {/* Height Restriction Visualization */}
      {heightVisuals}

      {/* Human figures for scale */}
      <HumanFigure position={[LOT_WIDTH/2 + 1, 0, -LOT_DEPTH/2 + 2]} />
      <HumanFigure position={[-LOT_WIDTH/2 - 1, 0, LOT_DEPTH/2 - 2]} />

      {/* Trees for scale */}
      <Tree position={[LOT_WIDTH/2 + 2, 0, 0]} />
      <Tree position={[-LOT_WIDTH/2 - 2, 0, 0]} />
    </group>
  );
}; 