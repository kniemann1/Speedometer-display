import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  gaugeType?: 'speed' | 'rpm' | 'fuel';
  colors?: {
    background?: string;
    ticks?: string;
    numbers?: string;
    needle?: string;
    valueText?: string;
  };
}

const Speedometer: React.FC<SpeedometerProps> = ({
  value,
  min = 0,
  max = 120,
  unit = 'km/h',
  size = { width: 800, height: 450 },  // 16:9 aspect ratio
  gaugeType = 'speed',
  colors = {}
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [dimensions, setDimensions] = useState(size);
  const [isMetric, setIsMetric] = useState(true);
  const [animationState, setAnimationState] = useState({
    isAnimating: false,
    isIncreasing: true,
    currentValue: gaugeType === 'speed' ? 30 : gaugeType === 'rpm' ? 1000 : 50,
    hasInterval: false
  });

  // Default colors based on gauge type
  const defaultColors = {
    speed: {
      background: '#334155',
      ticks: '#FFFFFF',
      numbers: '#FFFFFF',
      needle: '#FF3B30',
      valueText: '#FFFFFF'
    },
    rpm: {
      background: '#334155',
      ticks: '#FFFFFF',
      numbers: '#FFFFFF',
      needle: '#FF9500',
      valueText: '#FFFFFF'
    },
    fuel: {
      background: '#334155',
      ticks: '#FFFFFF',
      numbers: '#FFFFFF',
      needle: '#34C759',
      valueText: '#FFFFFF'
    }
  };

  // Merge provided colors with defaults
  const mergedColors = {
    background: colors.background || defaultColors[gaugeType].background,
    ticks: colors.ticks || defaultColors[gaugeType].ticks,
    numbers: colors.numbers || defaultColors[gaugeType].numbers,
    needle: colors.needle || defaultColors[gaugeType].needle,
    valueText: colors.valueText || defaultColors[gaugeType].valueText
  };

  // Debug logging for state changes
  useEffect(() => {
    console.log('Animation State:', animationState);
  }, [animationState]);

  // Handle animation toggle
  const handleAnimationToggle = useCallback(() => {
    console.log('Toggle clicked, current state:', animationState);
    
    if (animationState.isAnimating) {
      // Clear the interval and reset animation state
      if (intervalRef.current) {
        console.log('Clearing interval in toggle handler');
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setAnimationState(prev => {
        // Prevent duplicate updates
        if (!prev.isAnimating) return prev;
        
        console.log('Stopping animation - Previous state:', prev);
        const newState = {
          ...prev,
          isAnimating: false,
          hasInterval: false,
          currentValue: prev.currentValue
        };
        console.log('Stopping animation - New state:', newState);
        return newState;
      });
    } else {
      // Just set the animation state to true, the effect will handle the interval
      setAnimationState(prev => {
        // Prevent duplicate updates
        if (prev.isAnimating) return prev;
        
        console.log('Starting animation - Previous state:', prev);
        const newState = {
          ...prev,
          isAnimating: true,
          hasInterval: true,
          currentValue: prev.currentValue
        };
        console.log('Starting animation - New state:', newState);
        return newState;
      });
    }
  }, [animationState.isAnimating]);

  // Animation effect
  useEffect(() => {
    console.log('Animation effect triggered:', animationState);

    // Clear any existing interval first
    if (intervalRef.current) {
      console.log('Clearing existing interval');
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (animationState.isAnimating) {
      console.log('Starting new animation interval');
      
      // Different animation ranges based on gauge type
      let minValue, maxValue, step;
      
      switch(gaugeType) {
        case 'rpm':
          minValue = 1000;
          maxValue = 6000;
          step = 50;
          break;
        case 'fuel':
          minValue = 25;
          maxValue = 75;
          step = 0.5;
          break;
        case 'speed':
        default:
          minValue = 30;
          maxValue = 90;
          step = 0.5;
          break;
      }
      
      // Ensure we start from a valid value
      if (animationState.currentValue < minValue) {
        setAnimationState(prev => ({
          ...prev,
          currentValue: minValue,
          isIncreasing: true
        }));
      } else if (animationState.currentValue > maxValue) {
        setAnimationState(prev => ({
          ...prev,
          currentValue: maxValue,
          isIncreasing: false
        }));
      }
      
      // For testing, force the value to be close to 90 to see direction change
      // Uncomment this to quickly test the direction change at 90
      /*
      setAnimationState(prev => ({
        ...prev,
        currentValue: 89,
        isIncreasing: true
      }));
      */
      
      const tick = () => {
        console.log('Interval tick started');
        setAnimationState(prev => {
          // Prevent updates if animation is stopped
          if (!prev.isAnimating) return prev;
          
          console.log('Interval tick - Previous state:', prev);
          let newValue = prev.currentValue;
          let newDirection = prev.isIncreasing;

          // Calculate new value based on current direction
          if (prev.isIncreasing) {
            newValue = Number((prev.currentValue + step).toFixed(1));
            console.log('Increasing - New value before limit check:', newValue);
            if (newValue >= maxValue) {
              console.log('Reached upper limit, changing direction');
              newValue = maxValue;
              newDirection = false;
            }
          } else {
            newValue = Number((prev.currentValue - step).toFixed(1));
            console.log('Decreasing - New value before limit check:', newValue);
            if (newValue <= minValue) {
              console.log('Reached lower limit, changing direction');
              newValue = minValue;
              newDirection = true;
            }
          }

          const newState = {
            ...prev,
            currentValue: newValue,
            isIncreasing: newDirection
          };
          console.log('Interval tick - New state:', newState);
          return newState;
        });
        console.log('Interval tick completed');
      };

      // Run the first tick immediately
      tick();
      // Then set up the interval - use a faster interval
      intervalRef.current = setInterval(tick, 200); // Even faster for testing
    }

    // Cleanup function
    return () => {
      console.log('Cleanup function called');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [animationState.isAnimating]);

  // Convert between units
  const convertValue = (val: number, toMetric: boolean) => {
    return toMetric ? val * 1.60934 : val / 1.60934;
  };

  // Get current value and max in the correct unit
  const currentValue = isMetric ? animationState.currentValue : convertValue(animationState.currentValue, false);
  const currentMax = isMetric ? max : convertValue(max, false);
  const currentUnit = isMetric ? 'km/h' : 'mph';

  // Window resize effect
  useEffect(() => {
    const updateDimensions = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        const { width, height } = container.getBoundingClientRect();
        // Maintain 16:9 aspect ratio
        const newWidth = Math.min(width, size.width);
        const newHeight = (newWidth * 9) / 16;
        setDimensions({
          width: newWidth,
          height: newHeight
        });
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, [size]);

  // D3 rendering effect
  useEffect(() => {
    console.log('D3 rendering effect triggered with value:', animationState.currentValue);
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;
    
    // Create scale for needle position (top to bottom)
    const needleScale = d3.scaleLinear()
      .domain([min, currentMax])
      .range([-Math.PI / 2, Math.PI / 2]); // -90 to 90 degrees (top to bottom)
    
    // Create scale for tick marks (left to right)
    const tickScale = d3.scaleLinear()
      .domain([min, currentMax])
      .range([-Math.PI, 0]); // -180 to 0 degrees (left to right)
    
    // Only clear and redraw everything if dimensions or units change
    if (!svg.select('.speedometer-container').size()) {
      svg.selectAll('*').remove();
      
      // Create container group
      const g = svg.append('g')
        .attr('class', 'speedometer-container')
        .attr('transform', `translate(${width / 2 + margin.left},${height / 2 + margin.top})`);

      // Add a semi-circular background arc to make the gauge more visible
      const arcGenerator = d3.arc()
        .innerRadius(radius * 0.75)
        .outerRadius(radius * 0.85)
        .startAngle(-Math.PI / 2)  // Top (-90 degrees)
        .endAngle(Math.PI / 2);    // Bottom (90 degrees)

      g.append('path')
        .attr('d', arcGenerator({} as any))
        .attr('fill', mergedColors.background)
        .attr('class', 'gauge-background');

      // Update needle position
      const needleLength = radius * 0.7;
      const needleRadius = radius * 0.02;

      // Remove old needle
      g.select('.needle').remove();

      // Add new needle with smoother transition
      const needle = g.append('g')
        .attr('class', 'needle');

      needle.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', -needleLength)
        .style('stroke', mergedColors.needle)
        .style('stroke-width', needleRadius);

      // Add needle center circle
      needle.append('circle')
        .attr('class', 'needle-center')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', radius * 0.1)
        .style('fill', mergedColors.needle);

      // Add value text with smoother transition
      g.select('.value-text').remove();
      const valueText = g.append('text')
        .attr('class', 'value-text')
        .attr('x', 0)
        .attr('y', radius * 0.4)
        .attr('text-anchor', 'middle')
        .attr('font-size', '28px')
        .attr('font-weight', 'bold')
        .attr('fill', mergedColors.valueText);

      g.append('text')
        .attr('class', 'unit-text')
        .attr('x', 0)
        .attr('y', radius * 0.5)
        .attr('text-anchor', 'middle')
        .attr('font-size', '16px')
        .attr('fill', mergedColors.valueText);

      // Generate tick values for the visible range only
      const tickCount = 13; // To get nice intervals of 10 for 0-120
      const tickValues = d3.range(tickCount).map(i => {
        const tickValue = min + (i * (currentMax - min) / (tickCount - 1));
        return tickValue;
      });

      // Add tick marks only within the arc range
      const tickLength = radius * 0.1;
      g.selectAll('.tick')
        .data(tickValues)
        .enter()
        .append('g')
        .attr('class', 'tick')
        .attr('transform', d => {
          const angle = tickScale(d); // Use tickScale for positioning
          return `rotate(${(angle * 180) / Math.PI})`;
        })
        .append('line')
        .attr('x1', radius * 0.8)
        .attr('y1', 0)
        .attr('x2', radius * 0.8 + tickLength)
        .attr('y2', 0)
        .style('stroke', mergedColors.ticks)
        .style('stroke-width', 2);

      // Add tick labels
      g.selectAll('.tick-label')
        .data(tickValues)
        .enter()
        .append('text')
        .attr('class', 'tick-label')
        .attr('transform', d => {
          const angle = tickScale(d); // Use tickScale for positioning
          const labelRadius = radius * 0.95;
          const x = labelRadius * Math.cos(angle);
          const y = labelRadius * Math.sin(angle);
          return `translate(${x},${y})`;
        })
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('fill', mergedColors.ticks)
        .style('font-size', `${radius * 0.08}px`)
        .text(d => Math.round(d));

      // Add unit toggle button
      const button = svg
        .append('g')
        .attr('class', 'unit-toggle')
        .attr('transform', `translate(${width - 60}, ${height - 40})`)
        .style('cursor', 'pointer')
        .on('click', () => setIsMetric(!isMetric));

      button.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 60)
        .attr('height', 30)
        .attr('rx', 15)
        .style('fill', mergedColors.background);

      button.append('text')
        .attr('x', 30)
        .attr('y', 15)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('fill', mergedColors.valueText)
        .style('font-size', '12px')
        .text(currentUnit);

      // Add animation control button
      const animButton = svg
        .append('g')
        .attr('class', 'animation-toggle')
        .attr('transform', `translate(${width - 130}, ${height - 40})`)
        .style('cursor', 'pointer')
        .on('click', handleAnimationToggle);

      animButton.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 60)
        .attr('height', 30)
        .attr('rx', 15)
        .style('fill', animationState.isAnimating ? mergedColors.needle : mergedColors.background);

      animButton.append('text')
        .attr('x', 30)
        .attr('y', 15)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('fill', mergedColors.valueText)
        .style('font-size', '12px')
        .text(animationState.isAnimating ? 'Stop' : 'Start');
    }

    // Update needle position
    const needle = svg.select('.needle');
    if (needle.size()) {
      const angleRad = needleScale(animationState.currentValue); // Use needleScale for needle
      
      console.log('Updating needle position:', {
        currentValue: animationState.currentValue,
        angleRad: angleRad,
        angleDegrees: (angleRad * 180) / Math.PI,
        isAnimating: animationState.isAnimating
      });

      needle.transition()
        .duration(400) // Faster transitions
        .ease(d3.easeQuadInOut)
        .attr('transform', `rotate(${(angleRad * 180) / Math.PI})`);

      // Update value text
      const valueText = svg.select('.value-text');
      if (valueText.size()) {
        valueText.transition()
          .duration(400) // Faster transitions
          .ease(d3.easeQuadInOut)
          .tween('text', function() {
            const element = this as SVGTextElement;
            const currentTextValue = element.textContent ? parseFloat(element.textContent.split(' ')[0]) : currentValue;
            const i = d3.interpolateNumber(currentTextValue, Math.round(currentValue));
            return function(t) {
              element.textContent = `${Math.round(i(t))} ${currentUnit}`;
            };
          });
      }

      // Update animation button text
      const buttonText = svg.select('.animation-toggle text');
      if (buttonText.size()) {
        buttonText.text(animationState.isAnimating ? 'Stop' : 'Start');
      }
      
      // Update animation button color
      const buttonRect = svg.select('.animation-toggle rect');
      if (buttonRect.size()) {
        buttonRect.style('fill', animationState.isAnimating ? mergedColors.needle : mergedColors.background);
      }
    }

    // Cleanup function
    return () => {
      // Only clear on unmount
      if (!animationState.isAnimating) {
        svg.selectAll('*').remove();
      }
    };
  }, [animationState.currentValue, animationState.isAnimating, dimensions, isMetric, currentUnit, min, currentMax, handleAnimationToggle]);

  return (
    <svg
      ref={svgRef}
      width={dimensions.width}
      height={dimensions.height}
      style={{ 
        maxWidth: '100%', 
        height: 'auto',
        display: 'block',
        margin: 'auto'
      }}
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      preserveAspectRatio="xMidYMid meet"
    />
  );
};

export default Speedometer;