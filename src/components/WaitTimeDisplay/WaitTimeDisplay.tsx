import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { AreaChart, Area, XAxis, ReferenceLine, ResponsiveContainer } from 'recharts';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.small};
  padding: ${theme.spacing.medium};
  background: white;
  border-radius: ${theme.borderRadius.medium};
  border: 1px solid rgba(203, 213, 225, 0.4);
  max-width: 480px;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${theme.spacing.small};
  margin-bottom: ${theme.spacing.small};
`;

const HeaderLabel = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: 14px;
  font-weight: 450;
`;

const WaitTime = styled.div`
  color: ${theme.colors.text.primary};
  font-size: 15px;
  font-weight: 500;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 80px;
  position: relative;
`;

const Disclaimer = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: 12px;
  line-height: 1.4;
  opacity: 0.7;
  text-align: center;
  margin-top: ${theme.spacing.small};
`;




interface WaitTimeDisplayProps {
  currentWaitTime: number;
}

export const WaitTimeDisplay = ({ currentWaitTime }: WaitTimeDisplayProps) => {
  // Create exponential curve data points
  const generateExponentialPoints = (currentTime: number) => {
    const points = [];
    const maxValue = 60;
    const base = 1.15; // Adjust this to control curve steepness
    
    // Generate points for smooth curve
    for (let i = 0; i <= maxValue; i += 5) {
      const normalizedX = i / maxValue;
      const value = (Math.pow(base, normalizedX * 4) - 1) * 15;
      points.push({ minute: i, value: Math.min(value, 60) });
    }
    
    // Add current wait time point
    points.push({ 
      minute: currentTime, 
      value: (Math.pow(base, (currentTime/maxValue) * 4) - 1) * 15 
    });
    
    // Sort to ensure proper rendering
    return points.sort((a, b) => a.minute - b.minute);
  };

  const waitTimeData = generateExponentialPoints(currentWaitTime);

  return (
    <Container>
      <Header>
        <HeaderLabel>Average wait time:</HeaderLabel>
        <WaitTime>{currentWaitTime} minutes</WaitTime>
      </Header>

      <ChartContainer>
        <ResponsiveContainer>
          <AreaChart
            data={waitTimeData}
            margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="waitTimeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" /> {/* Blue */}
                <stop offset="50%" stopColor="#6366f1" /> {/* Indigo */}
                <stop offset="100%" stopColor="#ef4444" /> {/* Red */}
              </linearGradient>
            </defs>
            <XAxis
              dataKey="minute"
              type="number"
              domain={[0, 60]}
              ticks={[0, 15, 30, 45, 60]}
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickFormatter={(value) => value === 60 ? '60+' : value.toString()}
              axisLine={false}
              tickLine={false}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="url(#waitTimeGradient)"
              fill="url(#waitTimeGradient)"
              fillOpacity={0.15}
              isAnimationActive={true}
            />
            <ReferenceLine
              x={currentWaitTime}
              stroke={theme.colors.emergency}
              strokeWidth={2}
              strokeDasharray="3 3"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
      
      <Disclaimer>
        Wait times are estimated and may vary based on patient volume and medical priorities
      </Disclaimer>
    </Container>
  );
}; 