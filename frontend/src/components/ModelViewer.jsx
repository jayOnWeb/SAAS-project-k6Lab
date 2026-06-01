import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, OrbitControls, useGLTF, useProgress } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_URL = '/aether3d_1780055391173.glb';

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

function AetherModel({ hovered, setHovered, reducedMotion }) {
  const { scene } = useGLTF(MODEL_URL);
  const modelRef = useRef(null);
  const colors = useMemo(() => ({
    idleSurface: new THREE.Color('#d2d2d7'),
    hoverSurface: new THREE.Color('#f5f5f7'),
    idleGlow: new THREE.Color('#07111f'),
    hoverGlow: new THREE.Color('#0a3d78'),
  }), []);

  const materials = useMemo(() => {
    const meshMaterials = [];

    scene.traverse((child) => {
      if (!child.isMesh) return;

      child.frustumCulled = true;
      child.castShadow = false;
      child.receiveShadow = false;
      child.material = new THREE.MeshPhysicalMaterial({
        color: '#d2d2d7',
        metalness: 0.82,
        roughness: 0.28,
        clearcoat: 0.5,
        clearcoatRoughness: 0.34,
        emissive: '#07111f',
        emissiveIntensity: 0.18,
      });
      meshMaterials.push(child.material);
    });

    return meshMaterials;
  }, [scene]);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'grab' : '';
    return () => {
      document.body.style.cursor = '';
    };
  }, [hovered]);

  useFrame((state) => {
    if (!modelRef.current) return;

    const elapsed = state.clock.getElapsedTime();
    const targetY = reducedMotion ? 0 : Math.sin(elapsed * 0.7) * 0.08;
    const targetRotationY = reducedMotion ? 0.16 : elapsed * 0.18;
    const targetRotationX = hovered && !reducedMotion ? state.pointer.y * 0.08 : 0;

    modelRef.current.position.y = THREE.MathUtils.lerp(modelRef.current.position.y, targetY, 0.08);
    modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, targetRotationY, 0.06);
    modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, targetRotationX, 0.08);
    modelRef.current.scale.setScalar(THREE.MathUtils.lerp(modelRef.current.scale.x, hovered ? 1.18 : 1.12, 0.08));

    const surface = hovered ? colors.hoverSurface : colors.idleSurface;
    const glow = hovered ? colors.hoverGlow : colors.idleGlow;

    materials.forEach((material) => {
      material.color.lerp(surface, 0.08);
      material.emissive.lerp(glow, 0.08);
      material.emissiveIntensity = THREE.MathUtils.lerp(
        material.emissiveIntensity,
        hovered ? 0.34 : 0.18,
        0.08,
      );
    });
  });

  return (
    <group
      ref={modelRef}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        setHovered(false);
      }}
    >
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

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

export default function ModelViewer() {
  const [hovered, setHovered] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="model-viewer">
      <Suspense fallback={<ModelLoader />}>
        <Canvas
          camera={{ position: [0, 0, 5.6], fov: 38 }}
          dpr={[1, 1.25]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          performance={{ min: 0.6 }}
        >
          <ambientLight intensity={1.55} />
          <hemisphereLight args={['#ffffff', '#111111', 1.25]} />
          <directionalLight position={[4, 5, 6]} intensity={2.1} color="#ffffff" />
          <directionalLight position={[-5, -2, 2]} intensity={0.9} color="#8ab8ff" />
          <pointLight position={[0, 1.6, 3.6]} intensity={0.8} color="#0071e3" />

          <AetherModel
            hovered={hovered}
            setHovered={setHovered}
            reducedMotion={reducedMotion}
          />

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            autoRotate={!hovered && !reducedMotion}
            autoRotateSpeed={0.55}
            maxPolarAngle={Math.PI / 2 + 0.18}
            minPolarAngle={Math.PI / 2 - 0.45}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
