import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';

function StructuralCity() {
    const groupRef = useRef();

    // Generate building data once
    const buildings = useMemo(() => {
        return Array.from({ length: 30 }).map(() => ({
            position: [
                (Math.random() - 0.5) * 30,
                Math.random() * 5,
                (Math.random() - 0.5) * 30
            ],
            args: [
                1 + Math.random() * 2,
                4 + Math.random() * 12,
                1 + Math.random() * 2
            ]
        }));
    }, []);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y -= delta * 0.02; // Slow elegant rotation
        }
    });

    return (
        <group ref={groupRef} position={[0, -10, -15]}>
            <ambientLight intensity={0.2} />
            <directionalLight position={[10, 20, 10]} intensity={3.5} castShadow />

            {buildings.map((b, i) => (
                <mesh key={i} position={b.position}>
                    <boxGeometry args={b.args} />
                    <meshStandardMaterial
                        color={0x222222}
                        roughness={0.7}
                        metalness={0.3}
                    />
                    <Edges
                        linewidth={1}
                        threshold={15}
                        color="white"
                        transparent
                        opacity={0.06}
                    />
                </mesh>
            ))}

            <mesh position={[0, -1, 0]}>
                <cylinderGeometry args={[20, 20, 1, 64]} />
                <meshStandardMaterial color={0x050505} />
            </mesh>
        </group>
    );
}

export default function BackgroundCityCanvas({ opacity = 0.2 }) {
    return (
        <div
            className="fixed inset-0 pointer-events-none z-0"
            style={{ opacity, mixBlendMode: 'screen' }}
        >
            <Canvas camera={{ position: [0, 5, 20], fov: 45 }} style={{ pointerEvents: 'auto' }}>
                <fog attach="fog" args={['#030303', 10, 40]} />
                <StructuralCity />
            </Canvas>
        </div>
    );
}
