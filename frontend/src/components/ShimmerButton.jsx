import { motion } from "framer-motion";
import { useMemo, useState } from "react";

const shimmerGradient = "linear-gradient(-45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 100%)";

const ShimmerButton = ({ label = "Bắt đầu học", onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const shimmerTransition = useMemo(
    () => ({ duration: isHovered ? 1 : 2.5, ease: "linear", repeat: Infinity }),
    [isHovered]
  );

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <span className="relative z-[1] flex items-center gap-2">
        {label}
      </span>
      <motion.span
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
        initial={{ x: "-150%" }}
        animate={{ x: "150%" }}
        transition={shimmerTransition}
        style={{ backgroundImage: shimmerGradient, transform: "skewX(-15deg)" }}
      />
      <span className="pointer-events-none absolute inset-0 rounded-full bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-40" />
    </motion.button>
  );
};

export default ShimmerButton;






