import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Building } from './Building';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Box, useTheme } from '@mui/material';

export const BylawVisualizer = () => {
  const theme = useTheme();
  const activeBylaws = useSelector((state: RootState) => state.bylaws.active);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: theme.palette.background.default,
        position: 'relative',
      }}
    >
      <Canvas
        camera={{
          position: [10, 10, 10],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Building activeBylaws={activeBylaws} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={50}
        />
      </Canvas>
    </Box>
  );
}; 