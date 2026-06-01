import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, OrbitControls, useGLTF, useProgress } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_URL = '/aether3d_1780055391173.glb';

// --- Reduced-motion hook ---
function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reducedMotion;
}

// --- 3D Aether Model (Red theme) ---
function AetherModel({ reducedMotion }) {
  const { scene } = useGLTF(MODEL_URL);
  const modelRef = useRef(null);

  const materials = useMemo(() => {
    const meshMaterials = [];
    scene.traverse((child) => {
      if (!child.isMesh) return;
      child.frustumCulled = true;
      child.castShadow = false;
      child.receiveShadow = false;
      child.material = new THREE.MeshPhysicalMaterial({
        color: '#ff453a',
        metalness: 0.85,
        roughness: 0.22,
        clearcoat: 0.6,
        clearcoatRoughness: 0.3,
        emissive: '#3a0a08',
        emissiveIntensity: 0.35,
      });
      meshMaterials.push(child.material);
    });
    return meshMaterials;
  }, [scene]);

  useFrame((state) => {
    if (!modelRef.current) return;
    const elapsed = state.clock.getElapsedTime();
    const targetY = reducedMotion ? 0 : Math.sin(elapsed * 0.5) * 0.06;
    const targetRotationY = reducedMotion ? 0.16 : elapsed * 0.12;

    modelRef.current.position.y = THREE.MathUtils.lerp(modelRef.current.position.y, targetY, 0.06);
    modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, targetRotationY, 0.04);
    modelRef.current.scale.setScalar(THREE.MathUtils.lerp(modelRef.current.scale.x, 1.1, 0.06));
  });

  return (
    <group ref={modelRef}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

// --- Loading indicator ---
function ModelLoader() {
  const { progress } = useProgress();
  return (
    <div className="model-skeleton" role="status" aria-live="polite">
      <div className="model-loader">
        <span className="eyebrow">Loading Aether 3D</span>
        <div className="loader-bar" aria-label={`Model loading ${Math.round(progress)} percent`}>
          <span style={{ width: `${Math.max(progress, 12)}%` }} />
        </div>
      </div>
    </div>
  );
}

// --- Inline 3D viewer for the hero (exported as default for lazy loading) ---
export default function HeroModelViewer() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="hero-3d-canvas">
      <Suspense fallback={<ModelLoader />}>
        <Canvas
          camera={{ position: [0, 0, 5.6], fov: 38 }}
          dpr={[1, 1.25]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          performance={{ min: 0.5 }}
          style={{ pointerEvents: 'auto' }}
        >
          <ambientLight intensity={1.2} />
          <hemisphereLight args={['#ff8a80', '#1a0a0a', 1.0]} />
          <directionalLight position={[4, 5, 6]} intensity={2.2} color="#ffffff" />
          <directionalLight position={[-5, -2, 2]} intensity={0.7} color="#ff6b6b" />
          <pointLight position={[0, 1.6, 3.6]} intensity={1.2} color="#ff453a" />
          <pointLight position={[-3, -1, 2]} intensity={0.5} color="#ff1744" />

          <AetherModel reducedMotion={reducedMotion} />

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            autoRotate={!reducedMotion}
            autoRotateSpeed={0.4}
            maxPolarAngle={Math.PI / 2 + 0.18}
            minPolarAngle={Math.PI / 2 - 0.45}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
