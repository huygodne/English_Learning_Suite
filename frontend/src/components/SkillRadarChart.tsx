import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface SkillData {
  grammar: number;
  vocabulary: number;
  listening: number;
}

interface SkillRadarChartProps {
  data: SkillData;
  loading?: boolean;
}

const SkillRadarChart: React.FC<SkillRadarChartProps> = ({
  data = { grammar: 75, vocabulary: 82, listening: 68 },
  loading = false
}) => {
  const maxValue = 100;
  const svgSize = 280;
  const center = svgSize / 2;
  const radius = 100;
  const gridLevels = [20, 40, 60, 80, 100];

  const skills = [
    { name: 'Ngữ pháp', value: data.grammar, color: '#8b5cf6' },
    { name: 'Từ vựng', value: data.vocabulary, color: '#3b82f6' },
    { name: 'Nghe', value: data.listening, color: '#10b981' }
  ];

  const angleStep = (Math.PI * 2) / skills.length;

  const buildPolygon = useMemo(() => {
    return skills
      .map((skill, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const valueRadius = (radius * skill.value) / maxValue;
        const x = center + Math.cos(angle) * valueRadius;
        const y = center + Math.sin(angle) * valueRadius;
        return `${x},${y}`;
      })
      .join(' ');
  }, [skills, angleStep]);

  const gridPolygons = gridLevels.map((level) => {
    const levelRadius = (radius * level) / maxValue;
    const points = skills
      .map((_, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const x = center + Math.cos(angle) * levelRadius;
        const y = center + Math.sin(angle) * levelRadius;
        return `${x},${y}`;
      })
      .join(' ');
    return { level, points };
  });

  return (
    <motion.div
      className="relative rounded-3xl p-6 bg-white border border-slate-200 shadow-lg"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className="text-xl">📊</span>
        Biểu đồ Kỹ năng
      </h3>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <motion.div
            className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      ) : (
        <div className="relative">
          <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="w-full max-w-full overflow-visible">
            <circle cx={center} cy={center} r={radius} fill="none" stroke="#e2e8f0" strokeDasharray="4 4" />
            {gridPolygons.map((grid) => (
              <polygon
                key={grid.level}
                points={grid.points}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth={grid.level === 100 ? 1.5 : 1}
              />
            ))}
            {skills.map((_, index) => {
              const angle = index * angleStep - Math.PI / 2;
              const x = center + Math.cos(angle) * radius;
              const y = center + Math.sin(angle) * radius;
              return (
                <line key={index} x1={center} y1={center} x2={x} y2={y} stroke="#cbd5e1" strokeWidth={1} />
              );
            })}
            <polygon
              points={buildPolygon}
              fill="rgba(79, 70, 229, 0.25)"
              stroke="#4f46e5"
              strokeWidth={2}
            />
            {skills.map((skill, index) => {
              const angle = index * angleStep - Math.PI / 2;
              const valueRadius = (radius * skill.value) / maxValue;
              const x = center + Math.cos(angle) * valueRadius;
              const y = center + Math.sin(angle) * valueRadius;
              return (
                <circle key={skill.name} cx={x} cy={y} r={4} fill={skill.color} stroke="#fff" strokeWidth={1.5} />
              );
            })}
            {skills.map((skill, index) => {
              const angle = index * angleStep - Math.PI / 2;
              const labelRadius = radius + 28;
              const x = center + Math.cos(angle) * labelRadius;
              const y = center + Math.sin(angle) * labelRadius;
              return (
                <text
                  key={skill.name}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#475569"
                  fontSize="11"
                  fontWeight={600}
                >
                  {skill.name}
                </text>
              );
            })}
          </svg>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {skills.map((skill) => (
              <motion.div
                key={skill.name}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: skill.color }}
                  />
                  <span className="text-sm font-medium text-slate-700">{skill.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{Math.min(skill.value, 100)}%</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SkillRadarChart;

