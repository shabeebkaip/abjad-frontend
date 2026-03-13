"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 2000, suffix: "+", label: "Teachers registered", desc: "Active & verified educators" },
  { value: 500, suffix: "+", label: "Partner schools", desc: "Across the GCC region" },
  { value: 1200, suffix: "+", label: "Successful hires", desc: "And counting every day" },
  { value: 98, suffix: "%", label: "Satisfaction rate", desc: "From our placed teachers" },
];

function useCounter(target: number, duration = 2000, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, active]);
  return count;
}

function StatCard({ value, suffix, label, desc, active }: typeof stats[0] & { active: boolean }) {
  const count = useCounter(value, 1800, active);
  return (
    <div className="text-center">
      <p className="text-5xl font-bold text-white tabular-nums">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-white font-semibold mt-2 text-lg">{label}</p>
      <p className="text-white/60 text-sm mt-1">{desc}</p>
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0e7a81 0%, #2bbdc5 100%)" }}
    >
      {/* Decorative */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
            Trusted by the education community
          </h2>
          <p className="text-white/70 text-lg">
            Real numbers that reflect real impact
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}
