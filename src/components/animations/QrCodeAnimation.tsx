import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    Scene: THREE.Group;
  };
  materials: {
    [key: string]: THREE.Material;
  };
};

const Model = ({ scroll = 0, ...props }: { scroll?: number } & JSX.IntrinsicElements['group']) => {
  const mesh = useRef<THREE.Group>(null);
  const { nodes } = useGLTF('/3dmodels/nikbrk.glb') as GLTFResult;
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <group ref={mesh} scale={[1.5, 1.5, 1.5]} {...props}>
      <primitive object={nodes.Scene} />
    </group>
  );
};

export const QrCodeAnimation: React.FC = () => {
  return (
    <div className="w-full h-full pb-[200px]">
      <Canvas camera={{ position: [1, -2, 5], fov: 35 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <Model position={[0, 0, 0]} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          rotateSpeed={0.5}
          autoRotate
          autoRotateSpeed={1}
        />
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
};

useGLTF.preload('/3dmodels/nikbrk.glb'); 