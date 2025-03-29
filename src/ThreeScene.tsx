import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface SphereProps {
    color: string;
    position: [number, number, number];
}

const years =
    [1790, 1800, 1810, 1820, 1830, 1840, 1850, 1860, 1870, 1880, 1890, 1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020]


const ethnicities = {
    white: [1790, 1800, 1810, 1820, 1830, 1840, 1850, 1860, 1870, 1880, 1890, 1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020],
    blackorMixed: [1850, 1860, 1870, 1880, 1890, 1910, 1920],
    indian: [1860, 1870, 1880, 1890, 1900, 1910, 1920, 1930, 1940, 1950],
    chinese: [1860, 1870, 1880, 1890, 1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020],
    japanese: [1890, 1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020],
    hindu: [1920, 1930, 1940],
    korean: [1920, 1930, 1940, 1970, 1980, 1990, 2000, 2010, 2020],
    philippino: [1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020],
    mexican: [1930, 1970],
    partHawaiian: [1960],
    hawaiian: [1960, 1970, 1980, 1990, 2000, 2010],
    aleut: [1960, 1970, 1980, 1990],
    americanIndian: [1960, 1970, 1980, 1990],
    eskimo: [1960, 1980],
    puertoRican: [1970, 1980, 1990, 2000, 2010, 2020],
    cuban: [1970, 1980, 1990, 2000, 2010, 2020],
    centralorSouthAmerican: [1970],
    otherSpanish: [1970],
    guamanian: [1980, 1990, 2000],
    samoan: [1980, 1990, 2000, 2010, 2020],
    vietanmese: [1980, 1990, 2000, 2010, 2020],
    asianIndian: [1980, 1990, 2000, 2010, 2020],
    mexicanMexicanAmericanChicano: [1980, 1990, 2000, 2010, 2020],
    otherSpanishorHispanic: [1980, 1990],
    otherAPI: [1990],
    otherSpanishHispanicLatino: [2000, 2010, 2020],
    americanIndianorAlaskaNative: [2000, 2010, 2020],
    otherAsian: [2000, 2010, 2020],
    guamanianorChamorro: [2000, 2010, 2020],
    otherPacificIslander: [2000, 2010],
    black: [1790, 1800, 1810, 1820, 1830, 1840, 1900, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020]
};

const bins = [1790, 1830, 1870, 1910, 1950, 1990, 2030];

const ethnicityCounts: Record<string, Record<number, Array<Number>>> = {};

Object.entries(ethnicities).forEach(([group, years]) => {
    ethnicityCounts[group] = {};

    bins.forEach((bin, i) => {
        if (i === bins.length - 1) return;

        const start = bin;
        const end = bins[i + 1];

        const matchedYears = years.filter(year => year >= start && year < end);

        if (matchedYears.length > 0) {
            ethnicityCounts[group][start] = matchedYears;
        }
    });
});




function Sphere({ color, position }: SphereProps) {
    return (
        <mesh position={position}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color={new THREE.Color(color)} transparent opacity={0.8} />
        </mesh>
    );
}

const totalWidth = 69;
const getGap = (count: number) => count > 1 ? totalWidth / (count - 1) : 0;

const YEAR_LAYER_Y = -7.5;
const ETHNICITY_LAYER_Y = 7.5;


const generateYearPositions = () => {
    const gap = getGap(years.length);
    return years.map((year, index) => ({
        year,
        position: [index * gap, YEAR_LAYER_Y, 0]
    }));
};

const generateEthnicityPositions = () => {
    const ethnicityKeys = Object.keys(ethnicityCounts);
    const groupCount = ethnicityKeys.length;
    const gap = getGap(groupCount);
    const zGap = 1.2;

    return ethnicityKeys.map((group, i) => ({
        group,
        positions: bins.map((bin, j) => ({
            position: [i * gap, ETHNICITY_LAYER_Y, j * zGap],
            years: ethnicityCounts[group][bin] || []
        }))
    }));
};

// const AnimatedLine = ({ start, end }: { start: [number, number, number]; end: [number, number, number] }) => {
//     const ref = useRef<THREE.BufferGeometry>(null);
//     const [progress, setProgress] = useState(0);

//     console.log('aaa')

//     // 使用 useMemo 確保 position 陣列不會一直重新分配
//     const positions = useMemo(() => new Float32Array([...start, ...start]), [start]);

//     useFrame(() => {
//         if (progress < 1) {
//             setProgress((prev) => Math.min(prev + 0.02, 1));
//         }
//         if (ref.current) {
//             // 計算新的終點
//             const currentEnd = [
//                 start[0] + (end[0] - start[0]) * progress,
//                 start[1] + (end[1] - start[1]) * progress,
//                 start[2] + (end[2] - start[2]) * progress,
//             ];

//             // 更新 positions 陣列
//             positions.set([...start, ...currentEnd], 0);

//             // 更新 BufferGeometry
//             ref.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
//             ref.current.attributes.position.needsUpdate = true;
//         }
//     });

//     return (
//         <line>
//             <bufferGeometry ref={ref} />
//             <lineBasicMaterial color="blue" linewidth={2} />
//         </line>
//     );
// };

const AnimatedLine = ({
    start,
    end,
    fadeOut = false,
    onFadeOutComplete
}: {
    start: [number, number, number];
    end: [number, number, number];
    fadeOut?: boolean;
    onFadeOutComplete?: () => void;
}) => {
    const ref = useRef<THREE.BufferGeometry>(null);
    const [progress, setProgress] = useState(0);
    const [opacity, setOpacity] = useState(1);
    const materialRef = useRef<THREE.LineBasicMaterial>(null);

    const positions = useMemo(() => new Float32Array([...start, ...start]), [start]);

    useFrame(() => {
        if (!fadeOut) {
            if (progress < 1) {
                setProgress((prev) => Math.min(prev + 0.02, 1));
                const currentEnd = [
                    start[0] + (end[0] - start[0]) * progress,
                    start[1] + (end[1] - start[1]) * progress,
                    start[2] + (end[2] - start[2]) * progress,
                ];
                positions.set([...start, ...currentEnd], 0);
                ref.current?.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                //@ts-ignore
                ref.current.attributes.position.needsUpdate = true;
            }
        } else {
            setOpacity((prev) => {
                const next = prev - 0.03;
                if (next <= 0) {
                    onFadeOutComplete?.();
                    return 0;
                }
                return next;
            });
        }

        if (materialRef.current) {
            materialRef.current.opacity = opacity;
        }
    });

    return (
        <line>
            <bufferGeometry ref={ref} />
            <lineBasicMaterial
                ref={materialRef}
                color="blue"
                linewidth={2}
                transparent
                opacity={opacity}
            />
        </line>
    );
};



const ThreeScene: React.FC = () => {
    const yearPositions = generateYearPositions();
    const ethnicityPositions = generateEthnicityPositions();

    // const [visibleEthnicities, setVisibleEthnicities] = useState(0);
    const [currentEthnicityIndex, setCurrentEthnicityIndex] = useState(0);

    // const maxEthnicities = ethnicityPositions.length;

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setVisibleEthnicities((prev) => (prev < maxEthnicities ? prev + 1 : prev));
    //     }, 2000); // 每 2 秒增加 1 個種族

    //     return () => clearInterval(interval);
    // }, [maxEthnicities]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentEthnicityIndex((prev) => (prev + 1) % ethnicityPositions.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Canvas camera={{ position: [4.5, 0, 5], fov: 50 }} style={{ width: "100%", height: "100vh", background: "#1a1a1a" }}>
            <ambientLight intensity={0.7} />
            <OrbitControls />

            {yearPositions.map((hook, index) => (
                                //@ts-ignore
                <Sphere key={`hook-${index}`} color="orange" position={hook.position} />
            ))}

            {ethnicityPositions.map(({ positions }) =>
                positions.map(({ position, years }) =>
                    years.length > 0 ? (
                                        //@ts-ignore
                        <Sphere key={`ethnicity-${position[0]}-${position[2]}`} color="red" position={position} />
                    ) : null
                )
            )}
{/* 
            {ethnicityPositions[currentEthnicityIndex].positions.map(({ position, years }) =>
                years.length > 0 ? (
                    <Sphere key={`ethnicity-${position[0]}-${position[2]}`} color="red" position={position} />
                ) : null
            )} */}



            {/* {ethnicityPositions.slice(0, visibleEthnicities).map(({ positions }, groupIndex) =>
                positions.flatMap(({ position, years }, index) =>
                    years.map((year) => {
                        const yearPosition = yearPositions.find(y => y.year === year)?.position;
                        if (!yearPosition) {
                            console.error(`❌ 找不到年份位置: year=${year}`);
                            return null;
                        }
                        console.log(`✅ 渲染線條: groupIndex=${groupIndex}, index=${index}, year=${year}`);
                        return <AnimatedLine key={`line-${groupIndex}-${index}-${year}`} start={position} end={yearPosition} />;
                    })
                )
            )} */}

            {ethnicityPositions[currentEthnicityIndex].positions.flatMap(({ position, years }, index) =>
                years.map((year) => {
                    const yearPosition = yearPositions.find(y => y.year === year)?.position;
                    if (!yearPosition) {
                        console.error(`❌ 找不到年份位置: year=${year}`);
                        return null;
                    }
                    return (
                        <AnimatedLine
                            key={`line-${currentEthnicityIndex}-${index}-${year}`}
                                            //@ts-ignore
                            start={position}
                                            //@ts-ignore
                            end={yearPosition}
                        />
                    );
                })
            )}


        </Canvas>
    );
};

export default ThreeScene;
