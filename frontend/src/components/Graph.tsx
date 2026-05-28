"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface GraphData {
  nodes: { id: string; type: string; title?: string }[];
  links: { source: string; target: string; relation: string }[];
}

type SimulationNode = GraphData["nodes"][number] & {
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
};

type SimulationLink = {
  source: SimulationNode;
  target: SimulationNode;
  relation: string;
};

type D3DragEvent = {
  active: boolean;
  subject: SimulationNode;
  x: number;
  y: number;
};

function graphDrag(simulation: {
  alphaTarget: (value: number) => { restart: () => void };
}) {
  function dragstarted(event: D3DragEvent) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event: D3DragEvent) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event: D3DragEvent) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
}

export default function Graph({ data }: { data: GraphData }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !data.nodes.length) return;

    d3.select(containerRef.current).selectAll("*").remove();

    const width = containerRef.current.clientWidth;
    const height = 400;
    const nodes = data.nodes.map((node) => ({ ...node })) as SimulationNode[];
    const links = data.links.map((link) => ({ ...link })) as unknown as SimulationLink[];

    const svg = d3
      .select(containerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr(
        "style",
        "max-width: 100%; height: auto; border-radius: 12px; background: rgba(0,0,0,0.2);",
      );

    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: SimulationNode) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(30));

    const link = svg
      .append("g")
      .attr("stroke", "var(--border-color)")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 2);

    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d: SimulationNode) => (d.type === "paper" ? 12 : 8))
      .attr("fill", (d: SimulationNode) => {
        if (d.type === "paper") return "var(--accent-purple)";
        if (d.type === "reviewer") return "var(--accent-red)";
        return "var(--accent-cyan)";
      })
      .call(graphDrag(simulation));

    node
      .append("title")
      .text((d: SimulationNode) => (d.title ? `${d.type}: ${d.title}` : `${d.type}: ${d.id}`));

    const labels = svg
      .append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("dx", 15)
      .attr("dy", 4)
      .text((d: SimulationNode) => (d.id.length > 15 ? `${d.id.substring(0, 15)}...` : d.id))
      .attr("fill", "var(--text-secondary)")
      .attr("font-size", "10px")
      .attr("font-family", "JetBrains Mono");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: SimulationLink) => d.source.x ?? 0)
        .attr("y1", (d: SimulationLink) => d.source.y ?? 0)
        .attr("x2", (d: SimulationLink) => d.target.x ?? 0)
        .attr("y2", (d: SimulationLink) => d.target.y ?? 0);

      node.attr("cx", (d: SimulationNode) => d.x ?? 0).attr("cy", (d: SimulationNode) => d.y ?? 0);
      labels.attr("x", (d: SimulationNode) => d.x ?? 0).attr("y", (d: SimulationNode) => d.y ?? 0);
    });

    return () => {
      simulation.stop();
    };
  }, [data]);

  return (
    <div style={{ position: "relative", width: "100%", height: "400px" }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
