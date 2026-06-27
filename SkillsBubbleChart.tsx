import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Candidate } from "../types";
import { Sliders, HelpCircle, RefreshCw } from "lucide-react";

interface SkillsBubbleChartProps {
  candidates: Candidate[];
  onSkillClick?: (skill: string) => void;
  selectedSkill?: string;
}

interface BubbleNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  value: number;
  r: number;
  x?: number;
  y?: number;
}

export function SkillsBubbleChart({ candidates, onSkillClick, selectedSkill }: SkillsBubbleChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 350 });
  const [limit, setLimit] = useState<number>(30); // Top N skills
  const [minCount, setMinCount] = useState<number>(1);
  const [hoveredSkill, setHoveredSkill] = useState<{ name: string; count: number; candidates: string[] } | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // 1. Calculate dimensions responsively
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        // Keep proportional height
        const height = Math.max(300, Math.min(400, width * 0.55));
        setDimensions({ width: Math.max(300, width), height });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // 2. Process skill frequencies
  const allSkillsData = React.useMemo(() => {
    const counts: { [key: string]: { count: number; candidates: string[] } } = {};
    candidates.forEach((c) => {
      if (c.skills && Array.isArray(c.skills)) {
        c.skills.forEach((skill) => {
          const trimmed = skill.trim();
          if (!trimmed) return;
          if (!counts[trimmed]) {
            counts[trimmed] = { count: 0, candidates: [] };
          }
          counts[trimmed].count += 1;
          counts[trimmed].candidates.push(c.name);
        });
      }
    });

    return Object.entries(counts)
      .map(([name, data]) => ({
        name,
        count: data.count,
        candidates: data.candidates,
      }))
      .filter((item) => item.count >= minCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }, [candidates, limit, minCount]);

  // 3. Render and run D3 force simulation
  useEffect(() => {
    if (!svgRef.current || allSkillsData.length === 0) return;

    const width = dimensions.width;
    const height = dimensions.height;

    // Clear previous drawing
    const svgElement = d3.select(svgRef.current);
    svgElement.selectAll("*").remove();

    // Map data for simulation
    const maxVal = d3.max(allSkillsData, (d: { count: number }) => d.count) ?? 1;
    const minVal = d3.min(allSkillsData, (d: { count: number }) => d.count) ?? 1;

    // Radius scale: bubbles should scale gracefully between 18px and 45px
    const radiusScale = d3.scaleSqrt()
      .domain([1, maxVal])
      .range([18, 48]);

    // Color gradient scale matching our sophisticated palette
    const colorScale = d3.scaleOrdinal<string>()
      .domain(allSkillsData.map(d => d.name))
      .range([
        "#6366f1", // indigo-500
        "#ec4899", // pink-500
        "#f59e0b", // amber-500
        "#10b981", // emerald-500
        "#3b82f6", // blue-500
        "#8b5cf6", // violet-500
        "#f43f5e", // rose-500
        "#06b6d4"  // cyan-500
      ]);

    // Initialize nodes with starting positions at the center for a nice radial pop-out effect
    const nodes: BubbleNode[] = allSkillsData.map((d, i) => {
      const radius = radiusScale(d.count);
      return {
        id: d.name,
        name: d.name,
        value: d.count,
        r: radius,
        x: width / 2 + (Math.random() - 0.5) * 10,
        y: height / 2 + (Math.random() - 0.5) * 10,
      };
    });

    // Custom force layout
    const simulation = d3.forceSimulation<BubbleNode>(nodes)
      .force("center", d3.forceCenter(width / 2, height / 2).strength(0.08))
      .force("charge", d3.forceManyBody().strength(3))
      .force("collide", d3.forceCollide<BubbleNode>().radius(d => d.r + 3).iterations(3))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1));

    // Create container group for zoom/pan or centering
    const g = svgElement.append("g");

    // Add glowing filter definitions for a futuristic dark theme visual style
    const defs = svgElement.append("defs");
    
    // Gradient definitions
    allSkillsData.forEach((d, i) => {
      const baseColor = colorScale(d.name);
      const gradient = defs.append("linearGradient")
        .attr("id", `grad-${i}`)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%");
      
      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", baseColor)
        .attr("stop-opacity", 0.9);
      
      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", d3.color(baseColor)?.darker(1.2)?.toString() || baseColor)
        .attr("stop-opacity", 0.7);
    });

    const filter = defs.append("filter")
      .attr("id", "glow")
      .attr("x", "-20%")
      .attr("y", "-20%")
      .attr("width", "140%")
      .attr("height", "140%");

    filter.append("feGaussianBlur")
      .attr("stdDeviation", "4")
      .attr("result", "blur");

    filter.append("feComposite")
      .attr("in", "SourceGraphic")
      .attr("in2", "blur")
      .attr("operator", "over");

    // Create node group
    const nodeElements = g.selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        if (onSkillClick) {
          onSkillClick(d.name);
        }
      })
      .on("mouseover", function (event, d) {
        // Highlight current node
        d3.select(this).select("circle")
          .transition()
          .duration(150)
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 2.5)
          .style("filter", "url(#glow)");

        // Get matching data
        const matched = allSkillsData.find((item) => item.name === d.name);
        if (matched) {
          setHoveredSkill({
            name: matched.name,
            count: matched.count,
            candidates: matched.candidates,
          });
        }
      })
      .on("mousemove", (event) => {
        // Calculate tooltip position relative to container
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setTooltipPos({
            x: event.clientX - rect.left + 15,
            y: event.clientY - rect.top + 15,
          });
        }
      })
      .on("mouseleave", function () {
        // Restore styling
        const d = d3.select(this).datum() as BubbleNode;
        const isCurrentSelected = selectedSkill?.toLowerCase() === d.name.toLowerCase();

        d3.select(this).select("circle")
          .transition()
          .duration(150)
          .attr("stroke", isCurrentSelected ? "#6366f1" : "#1f2937") // indigo-500 or zinc-800
          .attr("stroke-width", isCurrentSelected ? 2.5 : 1)
          .style("filter", isCurrentSelected ? "url(#glow)" : null);

        setHoveredSkill(null);
      });

    // Draw background/circles
    nodeElements.append("circle")
      .attr("r", (d) => d.r)
      .attr("fill", (d, i) => `url(#grad-${i})`)
      .attr("stroke", (d) => selectedSkill?.toLowerCase() === d.name.toLowerCase() ? "#6366f1" : "#1f2937")
      .attr("stroke-width", (d) => selectedSkill?.toLowerCase() === d.name.toLowerCase() ? 2.5 : 1)
      .style("filter", (d) => selectedSkill?.toLowerCase() === d.name.toLowerCase() ? "url(#glow)" : null)
      .attr("class", "transition-colors duration-200");

    // Add labels (abbreviated or scaled size)
    nodeElements.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .attr("fill", "#ffffff")
      .style("font-size", (d) => {
        const textLen = d.name.length;
        const size = Math.max(8, Math.min(13, d.r * 2.2 / textLen));
        return `${size}px`;
      })
      .style("font-weight", "600")
      .style("pointer-events", "none")
      .text((d) => {
        if (d.r < 22 && d.name.length > 6) {
          return d.name.substring(0, 5) + "..";
        }
        return d.name;
      });

    // Add counts badge on large bubbles
    nodeElements.filter(d => d.r > 28)
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.4em")
      .attr("fill", "rgba(255, 255, 255, 0.7)")
      .style("font-size", "9px")
      .style("font-family", "monospace")
      .style("pointer-events", "none")
      .text(d => `${d.value} cands`);

    // Update positions during force simulation tick
    simulation.on("tick", () => {
      nodeElements.attr("transform", (d) => {
        // Constrain bubbles within bounds
        const r = d.r;
        const x = Math.max(r + 5, Math.min(width - r - 5, d.x || 0));
        const y = Math.max(r + 5, Math.min(height - r - 5, d.y || 0));
        d.x = x;
        d.y = y;
        return `translate(${x}, ${y})`;
      });
    });

    // Stop simulation when component unmounts
    return () => simulation.stop();
  }, [allSkillsData, dimensions, selectedSkill]);

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-xl relative overflow-hidden" ref={containerRef}>
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-zinc-800 pb-4 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse"></span>
            <span>Talent Skills Distribution (D3 Bubble Chart)</span>
          </h3>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Interactive D3 force map. Click any bubble to filter candidates with that skill.
          </p>
        </div>

        {/* Filters and Limits */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-500 font-medium">Limit:</span>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-md text-[11px] px-2 py-1 focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
            >
              <option value={15}>Top 15</option>
              <option value={25}>Top 25</option>
              <option value={40}>Top 40</option>
              <option value={60}>Top 60</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-500 font-medium">Min Cands:</span>
            <select
              value={minCount}
              onChange={(e) => setMinCount(Number(e.target.value))}
              className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-md text-[11px] px-2 py-1 focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
            >
              <option value={1}>&ge; 1 candidate</option>
              <option value={2}>&ge; 2 candidates</option>
              <option value={3}>&ge; 3 candidates</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bubble Chart Canvas */}
      <div className="relative min-h-[300px] flex items-center justify-center bg-zinc-950/40 rounded-lg border border-zinc-900">
        {allSkillsData.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center justify-center">
            <HelpCircle size={32} className="text-zinc-600 mb-2 animate-bounce" />
            <p className="text-xs text-zinc-500">No skill data matches current filters.</p>
          </div>
        ) : (
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            className="overflow-visible select-none"
          />
        )}

        {/* Custom Rich Floating Tooltip */}
        {hoveredSkill && (
          <div
            className="absolute z-50 bg-zinc-900 border border-zinc-700/80 shadow-2xl rounded-lg p-3 text-xs text-zinc-200 pointer-events-none w-64 transition-transform duration-75 ease-out backdrop-blur-md"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y}px`,
              transform: `translate(0, 0)`,
            }}
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 mb-1.5">
              <span className="font-bold text-white text-sm tracking-wide">{hoveredSkill.name}</span>
              <span className="bg-indigo-600/30 text-indigo-400 font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full border border-indigo-500/20">
                {hoveredSkill.count} {hoveredSkill.count === 1 ? "candidate" : "candidates"}
              </span>
            </div>
            
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block mb-1">
              Matching Talent
            </span>
            <div className="flex flex-wrap gap-1 max-h-[100px] overflow-y-auto pr-1">
              {hoveredSkill.candidates.map((name, index) => (
                <span
                  key={index}
                  className="bg-zinc-850 text-zinc-300 text-[10px] px-1.5 py-0.5 rounded border border-zinc-800 font-medium"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected Skill Highlight State */}
      {selectedSkill && (
        <div className="mt-3 flex items-center justify-between bg-indigo-950/30 border border-indigo-500/20 rounded-lg p-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
            <span className="text-xs text-zinc-300">
              Active Skill Filter: <strong className="text-white font-semibold">{selectedSkill}</strong>
            </span>
          </div>
          <button
            onClick={() => onSkillClick && onSkillClick("")}
            className="text-[10px] text-indigo-400 hover:text-indigo-300 font-medium hover:underline bg-transparent border-none cursor-pointer"
          >
            Clear Filter
          </button>
        </div>
      )}
    </div>
  );
}
