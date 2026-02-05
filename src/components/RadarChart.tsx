import { useMemo } from 'react';
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface CategoryData {
  category: string;
  level: number;
  fullMark: number;
}

interface RadarChartProps {
  data: CategoryData[];
  size?: 'sm' | 'md' | 'lg';
}

const RadarChart = ({ data, size = 'md' }: RadarChartProps) => {
  const sizeMap = {
    sm: 200,
    md: 320,
    lg: 400,
  };

  const chartSize = sizeMap[size];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card px-3 py-2 rounded-lg">
          <p className="font-medium text-foreground">{data.category}</p>
          <p className="text-primary font-mono text-lg">{data.level.toFixed(1)}/10</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="radar-container" style={{ height: chartSize, width: chartSize }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadar data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid 
            stroke="hsl(var(--border))" 
            strokeOpacity={0.5}
          />
          <PolarAngleAxis 
            dataKey="category" 
            tick={{ 
              fill: 'hsl(var(--muted-foreground))', 
              fontSize: size === 'sm' ? 10 : 12,
              fontWeight: 500 
            }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 10]} 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            tickCount={6}
          />
          <Radar
            name="Level"
            dataKey="level"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.3}
            strokeWidth={2}
            dot={{
              r: 4,
              fill: 'hsl(var(--primary))',
              strokeWidth: 2,
              stroke: 'hsl(var(--background))',
            }}
            activeDot={{
              r: 6,
              fill: 'hsl(var(--primary))',
              stroke: 'hsl(var(--background))',
              strokeWidth: 2,
            }}
          />
          <Tooltip content={<CustomTooltip />} />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChart;
