import { useGLTF } from "@react-three/drei";
import { useRef, useLayoutEffect, useMemo } from "react";
import * as THREE from "three";

export function ModelBuilding({
  targetSize,
  position = [0, 0, 0],
}: {
  targetSize: { width: number; height: number; depth: number };
  position?: [number, number, number];
}) {
  const gltf = useGLTF("/assets/3_storey_residential_building/scene.gltf");
  const model = useMemo(() => gltf.scene.clone(true), [gltf]);
  const groupRef = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    if (!groupRef.current) return;

    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // Force exact fit in all dimensions
    const scaleX = targetSize.width / size.x;
    const scaleY = targetSize.height / size.y;
    const scaleZ = targetSize.depth / size.z;
    model.scale.set(scaleX, scaleY, scaleZ);

    // Move model so its base is at y=0 and centered on x/z
    model.position.sub(center);
    model.position.y += size.y / 2;
  }, [model, targetSize]);

  return (
    <group ref={groupRef} position={position}>
      <primitive object={model} />
    </group>
  );
}
