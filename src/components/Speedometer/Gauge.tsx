import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface SpeedometerProps {
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  size?: {
    width: number;
    height: number;
  };
}

const Speedometer: React.FC<SpeedometerProps> = ({
  value,
  min = 0,
  max = 200,
  unit = 'km/h',
  size = { width: 800, height: 450 }
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = size.width - margin.left - margin.right;
    const height = size.height - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2 + margin.left},${height / 2 + margin.top})`);

    // Create gauge background
    const arc = d3.arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.8)
      .startAngle(-Math.PI * 0.75)
      .endAngle(Math.PI * 0.75);

    g.append('path')
      .datum({ endAngle: Math.PI * 0.75 })
      .style('fill', '#334155')
      .attr('d', arc as any);

    // Create value arc
    const scale = d3.scaleLinear()
      .domain([min, max])
      .range([-Math.PI * 0.75, Math.PI * 0.75]);

    const valueArc = d3.arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.8)
      .startAngle(-Math.PI * 0.75)
      .endAngle(scale(value));

    g.append('path')
      .style('fill', '#22c55e')
      .attr('d', valueArc as any);

    // Add needle
    const needleLength = radius * 0.7;
    const needleRadius = radius * 0.02;
    const angleRad = scale(value);

    const needle = g.append('g')
      .attr('class', 'needle')
      .attr('transform', `rotate(${(angleRad * 180) / Math.PI})`);

    needle.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', -needleLength)
      .style('stroke', '#ef4444')
      .style('stroke-width', needleRadius);

    // Add center circle
    g.append('circle')
      .attr('class', 'needle-center')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', radius * 0.1)
      .style('fill', '#ef4444');

    // Add value text
    g.append('text')
      .attr('class', 'value-text')
      .attr('x', 0)
      .attr('y', radius * 0.3)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-size', `${radius * 0.2}px`)
      .style('fill', 'white')
      .text(`${Math.round(value)} ${unit}`);

    // Add tick marks
    const ticks = scale.ticks(10);
    const tickLength = radius * 0.1;

    g.selectAll('.tick')
      .data(ticks)
      .enter()
      .append('g')
      .attr('class', 'tick')
      .attr('transform', d => `rotate(${(scale(d) * 180) / Math.PI})`)
      .append('line')
      .attr('x1', radius * 0.8)
      .attr('y1', 0)
      .attr('x2', radius * 0.8 + tickLength)
      .attr('y2', 0)
      .style('stroke', 'white')
      .style('stroke-width', 2);

    // Add tick labels
    g.selectAll('.tick-label')
      .data(ticks)
      .enter()
      .append('text')
      .attr('class', 'tick-label')
      .attr('x', (d) => {
        const tickAngle = scale(d);
        return (radius * 0.95) * Math.cos(tickAngle);
      })
      .attr('y', (d) => {
        const tickAngle = scale(d);
        return (radius * 0.95) * Math.sin(tickAngle);
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('fill', 'white')
      .style('font-size', `${radius * 0.08}px`)
      .text(d => d);

  }, [value, min, max, unit, size]);

  return (
    <svg
      ref={svgRef}
      width={size.width}
      height={size.height}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
};

export default Speedometer; 