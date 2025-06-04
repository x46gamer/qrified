import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

const Model = ({ scroll = 0, ...props }) => {
  const mesh = useRef<THREE.Group>(null);
  const { nodes, materials } = useGLTF('/3dmodels/nikbrk.glb');
  
  useFrame((state) => {
    if (mesh.current) {
  
    }
  });

  return (
    <group ref={mesh} scale={[0.5, 0.5, 0.5]} {...props}>
      <primitive object={nodes.Scene} />
    </group>
  );
};

export const QrCodeAnimation: React.FC<{ scrollProgress?: number }> = ({ 
  scrollProgress = 0 
}) => {
  return (
    <div className="w-full h-full">
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