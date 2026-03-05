/* ===== FRETBOARD DIAGRAM ===== */
/* Clean Architecture: Presentation Layer - Core Component */
/* Custom SVG-based guitar fretboard renderer */

import type { ChordVariation } from '@/domain/types';
import './FretboardDiagram.css';

interface FretboardDiagramProps {
    variation: ChordVariation;
    width?: number;
    numFrets?: number;
    numStrings?: number;
}

const COLORS = {
    accent: '#0dccf2',
    accentDim: 'rgba(13, 204, 242, 0.25)',
    fretWire: 'rgba(255, 255, 255, 0.15)',
    string: 'rgba(255, 255, 255, 0.25)',
    stringThick: 'rgba(255, 255, 255, 0.35)',
    nut: 'rgba(255, 255, 255, 0.6)',
    text: '#e8edf5',
    textDim: '#8896aa',
    fingerText: '#0a0f1a',
    muted: '#f87171',
    openString: '#34d399',
};

export function FretboardDiagram({
    variation,
    width = 200,
    numFrets = 5,
    numStrings = 6
}: FretboardDiagramProps) {
    /* Layout calculations */
    const padding = { top: 28, bottom: 12, left: 30, right: 16 };
    const fretboardWidth = width - padding.left - padding.right;
    const stringSpacing = fretboardWidth / (numStrings - 1);
    const fretHeight = 32;
    const fretboardHeight = fretHeight * numFrets;
    const svgHeight = fretboardHeight + padding.top + padding.bottom;
    const dotRadius = stringSpacing * 0.32;

    const isOpenPosition = variation.BaseFret === 1;

    /* String X position (string 6 = left, string 1 = right) */
    const stringX = (stringNum: number) =>
        padding.left + (numStrings - stringNum) * stringSpacing;

    /* Fret Y position (relative fret within the diagram) */
    const fretY = (relativeFret: number) =>
        padding.top + relativeFret * fretHeight;

    /* Dot Y center (between two frets) */
    const dotY = (absoluteFret: number) => {
        const relativeFret = absoluteFret - variation.BaseFret;
        return padding.top + (relativeFret + 0.5) * fretHeight;
    };

    return (
        <svg
            className="fretboard"
            width={width}
            height={svgHeight}
            viewBox={`0 0 ${width} ${svgHeight}`}
            role="img"
            aria-label={`Guitar chord diagram: ${variation.VariationName}`}
        >
            {/* Nut or fret marker */}
            {isOpenPosition ? (
                <line
                    x1={padding.left - 2}
                    y1={padding.top}
                    x2={padding.left + fretboardWidth + 2}
                    y2={padding.top}
                    stroke={COLORS.nut}
                    strokeWidth={3}
                    strokeLinecap="round"
                />
            ) : (
                <text
                    x={padding.left - 14}
                    y={padding.top + fretHeight * 0.6}
                    fill={COLORS.textDim}
                    fontSize={11}
                    fontWeight={600}
                    fontFamily="Inter, sans-serif"
                    textAnchor="end"
                >
                    {variation.BaseFret}fr
                </text>
            )}

            {/* Fret wires */}
            {Array.from({ length: numFrets + 1 }, (_, i) => (
                <line
                    key={`fret-${i}`}
                    x1={padding.left}
                    y1={fretY(i)}
                    x2={padding.left + fretboardWidth}
                    y2={fretY(i)}
                    stroke={i === 0 && !isOpenPosition ? COLORS.fretWire : COLORS.fretWire}
                    strokeWidth={i === 0 ? 1.5 : 0.8}
                />
            ))}

            {/* Strings */}
            {Array.from({ length: numStrings }, (_, i) => {
                const sNum = numStrings - i; // 6 to 1
                const x = stringX(sNum);
                const isBass = sNum >= 4;
                return (
                    <line
                        key={`string-${sNum}`}
                        x1={x}
                        y1={padding.top}
                        x2={x}
                        y2={padding.top + fretboardHeight}
                        stroke={isBass ? COLORS.stringThick : COLORS.string}
                        strokeWidth={isBass ? 1.2 : 0.8}
                    />
                );
            })}

            {/* Open / Muted string indicators */}
            {Array.from({ length: numStrings }, (_, i) => {
                const sNum = numStrings - i;
                const x = stringX(sNum);
                const isMuted = variation.MutedStrings.includes(sNum);
                const isOpen = variation.OpenStrings.includes(sNum);

                if (isMuted) {
                    return (
                        <text
                            key={`mut-${sNum}`}
                            x={x}
                            y={padding.top - 10}
                            fill={COLORS.muted}
                            fontSize={12}
                            fontWeight={700}
                            fontFamily="Inter, sans-serif"
                            textAnchor="middle"
                        >
                            ×
                        </text>
                    );
                }
                if (isOpen) {
                    return (
                        <circle
                            key={`open-${sNum}`}
                            cx={x}
                            cy={padding.top - 12}
                            r={5}
                            fill="none"
                            stroke={COLORS.openString}
                            strokeWidth={1.5}
                        />
                    );
                }
                return null;
            })}

            {/* Barre indicators */}
            {variation.Barres.map((barre, idx) => {
                const x1 = stringX(barre.EndString);
                const x2 = stringX(barre.StartString);
                const y = dotY(barre.Fret);
                const barreWidth = Math.abs(x2 - x1);

                return (
                    <g key={`barre-${idx}`}>
                        <rect
                            x={Math.min(x1, x2) - dotRadius}
                            y={y - dotRadius}
                            width={barreWidth + dotRadius * 2}
                            height={dotRadius * 2}
                            rx={dotRadius}
                            ry={dotRadius}
                            fill={COLORS.accent}
                            opacity={0.85}
                        />
                        <text
                            x={(x1 + x2) / 2}
                            y={y + 1}
                            fill={COLORS.fingerText}
                            fontSize={10}
                            fontWeight={700}
                            fontFamily="Inter, sans-serif"
                            textAnchor="middle"
                            dominantBaseline="central"
                        >
                            {barre.Finger}
                        </text>
                    </g>
                );
            })}

            {/* Finger positions (dots) */}
            {variation.Positions.map((pos, idx) => {
                const x = stringX(pos.String);
                const y = dotY(pos.Fret);

                // Skip if this position is covered by a barre at the same fret & string
                const coveredByBarre = variation.Barres.some(
                    b => b.Fret === pos.Fret && pos.String >= b.StartString && pos.String <= b.EndString
                );
                if (coveredByBarre) return null;

                return (
                    <g key={`pos-${idx}`}>
                        {/* Glow */}
                        <circle
                            cx={x}
                            cy={y}
                            r={dotRadius + 3}
                            fill={COLORS.accentDim}
                        />
                        {/* Dot */}
                        <circle
                            cx={x}
                            cy={y}
                            r={dotRadius}
                            fill={COLORS.accent}
                        />
                        {/* Finger number */}
                        <text
                            x={x}
                            y={y + 1}
                            fill={COLORS.fingerText}
                            fontSize={10}
                            fontWeight={700}
                            fontFamily="Inter, sans-serif"
                            textAnchor="middle"
                            dominantBaseline="central"
                        >
                            {pos.Finger}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}
