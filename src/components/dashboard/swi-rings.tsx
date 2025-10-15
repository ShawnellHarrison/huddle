"use client"
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Activity, Rocket, Bot } from 'lucide-react';
import React from 'react';

const Ring = ({
  radius,
  stroke,
  progress,
  colorClass,
}: {
  radius: number;
  stroke: number;
  progress: number;
  colorClass: string;
}) => {
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const [strokeDashoffset, setStrokeDashoffset] = React.useState(circumference);

  React.useEffect(() => {
    // Animate the stroke-dashoffset
    const finalOffset = circumference - (progress / 100) * circumference;
    setStrokeDashoffset(finalOffset);
  }, [progress, circumference]);

  return (
    <circle
      stroke="currentColor"
      className={cn("transition-all duration-1000 ease-out", colorClass)}
      strokeWidth={stroke}
      strokeDasharray={circumference + ' ' + circumference}
      style={{ strokeDashoffset }}
      strokeLinecap="round"
      fill="transparent"
      r={normalizedRadius}
      cx={radius + stroke / 2}
      cy={radius + stroke / 2}
    />
  );
};

export function SwiRings() {
  const rings = [
    { label: "Focus", progress: 75, color: "text-brand", icon: Activity, radius: 56, stroke: 8 },
    { label: "Impact", progress: 90, color: "text-accent", icon: Rocket, radius: 44, stroke: 8 },
    { label: "Automation", progress: 40, color: "text-peach", icon: Bot, radius: 32, stroke: 8 },
  ];
  const size = (rings[0].radius + rings[0].stroke) * 2;

  return (
    <div className="cozy-panel">
      <CardHeader>
        <CardTitle className="font-headline">SWI Rings</CardTitle>
        <CardDescription>Smart Work Index - Weekly</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row items-center justify-center gap-8">
        <div className="relative">
          <svg
            className="transform -rotate-90"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
          >
            {rings.map((ring, index) => (
              <circle
                key={`bg-${index}`}
                className="text-border"
                strokeWidth={ring.stroke}
                fill="transparent"
                r={ring.radius - ring.stroke / 2}
                cx={ring.radius + ring.stroke / 2}
                cy={ring.radius + ring.stroke / 2}
              />
            ))}
            {rings.map((ring, index) => (
              <Ring
                key={index}
                radius={ring.radius}
                stroke={ring.stroke}
                progress={ring.progress}
                colorClass={ring.color}
              />
            ))}
          </svg>
           <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-bold text-gradient-brand">82</span>
              <span className="text-xs text-muted-foreground">SWI Score</span>
           </div>
        </div>
        <div className="flex flex-col gap-4">
          {rings.map((ring, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", `bg-${ring.color.replace('text-', '')}/20`)}>
                <ring.icon className={cn("h-5 w-5", ring.color)} />
              </div>
              <div>
                <p className="font-semibold">{ring.label}</p>
                <p className="text-sm text-muted-foreground">{ring.progress}% complete</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </div>
  );
}
