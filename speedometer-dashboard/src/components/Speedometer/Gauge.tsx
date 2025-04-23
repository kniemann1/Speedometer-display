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

    // Create circular gauge scale
    const circularScale = d3.scaleLinear()
      .domain([min, currentMax])
      .range([0, 2 * Math.PI]); // 0 to 360 degrees (full circle)
    
    // Only clear and redraw everything if dimensions or units change
    if (!svg.select('.speedometer-container').size()) {
      svg.selectAll('*').remove();
      
      // Create container group
      const g = svg.append('g')
        .attr('class', 'speedometer-container')
        .attr('transform', `translate(${width / 2 + margin.left},${height / 2 + margin.top})`);

      // Draw the outer ring
      const outerRingGenerator = d3.arc()
        .innerRadius(radius * 0.8)
        .outerRadius(radius * 0.9)
        .startAngle(0)
        .endAngle(2 * Math.PI);

      g.append('path')
        .attr('d', outerRingGenerator({} as any))
        .attr('fill', mergedColors.background)
        .attr('class', 'gauge-outer-ring');
        
      // Draw the colored progress arc
      const progressArcGenerator = (endAngle: number) => {
        return d3.arc()
          .innerRadius(radius * 0.8)
          .outerRadius(radius * 0.9)
          .startAngle(0)
          .endAngle(endAngle);
      };
      
      // Determine color based on gauge type
      let gradientColors;
      switch(gaugeType) {
        case 'rpm':
          gradientColors = ['#3B82F6', '#8B5CF6', '#EF4444']; // Blue to purple to red
          break;
        case 'fuel':
          gradientColors = ['#FCD34D', '#10B981']; // Yellow to green
          break;
        default:
          gradientColors = ['#3B82F6', '#38BDF8']; // Blue tones
      }
      
      // Create gradient for progress arc
      const gradient = svg.append('defs')
        .append('linearGradient')
        .attr('id', `progressGradient-${gaugeType}`)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '0%');
      
      if (gradientColors.length === 3) {
        gradient.append('stop')
          .attr('offset', '0%')
          .attr('stop-color', gradientColors[0]);
          
        gradient.append('stop')
          .attr('offset', '50%')
          .attr('stop-color', gradientColors[1]);
          
        gradient.append('stop')
          .attr('offset', '100%')
          .attr('stop-color', gradientColors[2]);
      } else {
        gradient.append('stop')
          .attr('offset', '0%')
          .attr('stop-color', gradientColors[0]);
          
        gradient.append('stop')
          .attr('offset', '100%')
          .attr('stop-color', gradientColors[1]);
      }
      
      // Add progress arc
      g.append('path')
        .attr('class', 'gauge-progress')
        .attr('fill', `url(#progressGradient-${gaugeType})`)
        .attr('d', progressArcGenerator(circularScale(animationState.currentValue))({} as any));
      
      // Draw small tick marks around the circle
      const numTicks = 40;
      for (let i = 0; i < numTicks; i++) {
        const angle = (i * 2 * Math.PI) / numTicks;
        const isMajor = i % 5 === 0;
        const tickLength = isMajor ? radius * 0.12 : radius * 0.06;
        const tickWidth = isMajor ? 2 : 1;
        const tickOuterRadius = radius * 0.78;
        const tickInnerRadius = tickOuterRadius - tickLength;
        
        g.append('line')
          .attr('x1', tickInnerRadius * Math.cos(angle - Math.PI / 2))
          .attr('y1', tickInnerRadius * Math.sin(angle - Math.PI / 2))
          .attr('x2', tickOuterRadius * Math.cos(angle - Math.PI / 2))
          .attr('y2', tickOuterRadius * Math.sin(angle - Math.PI / 2))
          .style('stroke', isMajor ? '#FFFFFF' : '#888888')
          .style('stroke-width', tickWidth);
        
        if (isMajor) {
          const labelRadius = tickInnerRadius - 15;
          const value = min + (i / numTicks) * (currentMax - min);
          g.append('text')
            .attr('x', labelRadius * Math.cos(angle - Math.PI / 2))
            .attr('y', labelRadius * Math.sin(angle - Math.PI / 2))
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('font-size', '12px')
            .attr('fill', '#AAAAAA')
            .text(Math.round(value));
        }
      }
      
      // Hide the unit buttons since they're now shown in the layout
      // ... existing code continues ...
    }

    // Update the progress arc based on current value
    const progressArc = svg.select('.gauge-progress');
    if (progressArc.size()) {
      const arc = d3.arc()
        .innerRadius(radius * 0.8)
        .outerRadius(radius * 0.9)
        .startAngle(0);
      
      const startAngle = 0;
      const endAngle = circularScale(animationState.currentValue);
      
      progressArc.transition()
        .duration(400)
        .ease(d3.easeQuadInOut)
        .attr('d', arc({
          startAngle,
          endAngle
        } as any));
    }
    
    // Cleanup function
    return () => {
      // Only clear on unmount
      if (!animationState.isAnimating) {
        svg.selectAll('*').remove();
      }
    };
  }, [animationState.currentValue, animationState.isAnimating, dimensions, isMetric, currentUnit, min, currentMax, handleAnimationToggle, gaugeType]);

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