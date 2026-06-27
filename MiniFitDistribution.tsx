import React, { useMemo, useState } from "react";
import { RankingResult } from "../types";

interface MiniFitDistributionProps {
  scores: number[];
  totalCount: number;
}

export function MiniFitDistribution({ scores, totalCount }: MiniFitDistributionProps) {
  const [hoveredBin, setHoveredBin] = useState<{
    range: string;
    count: number;
    percent: number;
    index: number;
  } | null>(null);

  // Define 10 bins: 0-10, 11-20, ..., 91-100
  const bins = useMemo(() => {
    const binCounts = Array(10).fill(0);
    scores.forEach((score) => {
      // Clamp score between 0 and 100 just in case
      const clamped = Math.max(0, Math.min(100, score));
      // Calculate bin index (0 to 9)
      let binIndex = Math.floor(clamped / 10);
      if (binIndex >= 10) binIndex = 9; // 100 goes into the last bin
      binCounts[binIndex] += 1;
    });

    return binCounts.map((count, i) => {
      const minVal = i * 10;
      const maxVal = i === 9 ? 100 : (i + 1) * 10;
      return {
        index: i,
        range: `${minVal}-${maxVal}%`,
        count,
        percent: totalCount > 0 ? (count / totalCount) * 100 : 0,
      };
    });
  }, [scores, totalCount]);

  const maxBinCount = useMemo(() => {
    const max = Math.max(...bins.map((b) => b.count));
    return max > 0 ? max : 1;
  }, [bins]);

  // SVG dimensions
  const width = 160;
  const height = 36;
  const barPadding = 2;
  const numBins = bins.length;
  const barWidth = (width / numBins) - barPadding;

  return (
    <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800/60 rounded-xl px-3 py-1.5 backdrop-blur-sm relative select-none">
      <div className="flex flex-col">
        <span className="text-[9px] uppercase font-bold text-indigo-400 tracking-wider">
          Fit% Distribution
        </span>
        <span className="text-[10px] font-mono text-zinc-500 leading-tight">
          {scores.length} ranked
        </span>
      </div>

      <div className="relative flex items-center">
        {scores.length === 0 ? (
          <div className="flex gap-1 items-end h-[30px] w-[160px] opacity-20">
            {Array(10).fill(0).map((_, i) => (
              <div
                key={i}
                className="bg-zinc-700 w-[14px] rounded-t-sm"
                style={{ height: `${(i % 3 + 1) * 6}px` }}
              ></div>
            ))}
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono text-zinc-400 tracking-tight font-medium bg-zinc-950/20">
              No active scores
            </span>
          </div>
        ) : (
          <svg width={width} height={height} className="overflow-visible">
            <defs>
              <linearGradient id="miniBarGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#6366f1" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="miniBarHoverGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>

            {/* Bottom axis line */}
            <line
              x1={0}
              y1={height - 2}
              x2={width}
              y2={height - 2}
              stroke="#27272a"
              strokeWidth={1}
            />

            {/* Bins / Bars */}
            {bins.map((bin) => {
              const isHovered = hoveredBin?.index === bin.index;
              // Calculate height proportional to maximum bin count
              const barHeight = maxBinCount > 0 ? (bin.count / maxBinCount) * (height - 6) : 0;
              // Ensure even 0 counts have a microscopic indicator line (1px) so the histogram flow is trace-able
              const finalBarHeight = bin.count > 0 ? Math.max(2, barHeight) : 0.5;
              
              const xPos = bin.index * (barWidth + barPadding);
              const yPos = height - 2 - finalBarHeight;

              return (
                <rect
                  key={bin.index}
                  x={xPos}
                  y={yPos}
                  width={barWidth}
                  height={finalBarHeight}
                  rx={1}
                  ry={1}
                  fill={isHovered ? "url(#miniBarHoverGrad)" : "url(#miniBarGrad)"}
                  className="transition-all duration-150 cursor-pointer"
                  onMouseEnter={() => setHoveredBin(bin)}
                  onMouseLeave={() => setHoveredBin(null)}
                />
              );
            })}
          </svg>
        )}

        {/* Dynamic Tooltip */}
        {hoveredBin && hoveredBin.count > 0 && (
          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-zinc-950 border border-zinc-800 shadow-xl px-2 py-1 rounded text-[10px] text-zinc-300 font-mono flex flex-col gap-0.5 whitespace-nowrap z-30 pointer-events-none">
            <span className="font-semibold text-white text-center">
              {hoveredBin.range} Fit Range
            </span>
            <div className="flex items-center justify-between gap-3 text-zinc-400">
              <span>Count:</span>
              <span className="text-pink-400 font-bold">{hoveredBin.count}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col text-[8px] font-mono text-zinc-600 self-end pb-0.5 select-none">
        <span>100%</span>
        <span>0%</span>
      </div>
    </div>
  );
}
