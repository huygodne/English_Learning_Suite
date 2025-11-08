import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface SkillData {
  grammar: number;
  vocabulary: number;
  listening: number;
  speaking: number;
}

interface SkillRadarChartProps {
  data: SkillData;
  loading?: boolean;
}

const SkillRadarChart: React.FC<SkillRadarChartProps> = ({
  data = { grammar: 75, vocabulary: 82, listening: 68, speaking: 65 },
  loading = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maxValue = 100;
  const centerX = 120;
  const centerY = 120;
  const radius = 90;

  const skills = [
    { name: 'Ngữ pháp', value: data.grammar, color: '#8b5cf6' },
    { name: 'Từ vựng', value: data.vocabulary, color: '#3b82f6' },
    { name: 'Nghe', value: data.listening, color: '#10b981' },
    { name: 'Nói', value: data.speaking, color: '#f59e0b' }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid circles
    for (let i = 1; i <= 5; i++) {
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius * i) / 5, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw axes
    const angleStep = (Math.PI * 2) / skills.length;
    skills.forEach((_, index) => {
      const angle = (index * angleStep) - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    });

    // Draw data polygon
    ctx.fillStyle = 'rgba(79, 70, 229, 0.2)';
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 2;
    ctx.beginPath();

    skills.forEach((skill, index) => {
      const angle = (index * angleStep) - Math.PI / 2;
      const valueRadius = (radius * skill.value) / maxValue;
      const x = centerX + Math.cos(angle) * valueRadius;
      const y = centerY + Math.sin(angle) * valueRadius;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw points
    skills.forEach((skill, index) => {
      const angle = (index * angleStep) - Math.PI / 2;
      const valueRadius = (radius * skill.value) / maxValue;
      const x = centerX + Math.cos(angle) * valueRadius;
      const y = centerY + Math.sin(angle) * valueRadius;

      ctx.fillStyle = skill.color;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw labels
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    skills.forEach((skill, index) => {
      const angle = (index * angleStep) - Math.PI / 2;
      const labelRadius = radius + 25;
      const x = centerX + Math.cos(angle) * labelRadius;
      const y = centerY + Math.sin(angle) * labelRadius;

      ctx.fillText(skill.name, x, y);
    });
  }, [data, skills]);

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
          <canvas
            ref={canvasRef}
            width={240}
            height={240}
            className="w-full max-w-full"
          />
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
                <span className="text-sm font-bold text-slate-900">{skill.value}%</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SkillRadarChart;

