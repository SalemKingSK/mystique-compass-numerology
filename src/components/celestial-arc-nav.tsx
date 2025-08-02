// src/components/celestial-arc-nav.tsx
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface CelestialArcNavProps {
  categories: Category[];
  activeTab: string;
  setActiveTab: (id: string) => void;
}

export const CelestialArcNav: React.FC<CelestialArcNavProps> = ({
  categories,
  activeTab,
  setActiveTab,
}) => {
  const activeIndex = categories.findIndex((c) => c.id === activeTab);

  const displayCategories = React.useMemo(() => {
    const reordered: Category[] = new Array(categories.length).fill(null);
    const centerIndex = Math.floor(categories.length / 2);

    for (let i = 0; i < categories.length; i++) {
      const newPos = (i - activeIndex + centerIndex + categories.length) % categories.length;
      reordered[newPos] = categories[i];
    }
    return reordered;
  }, [activeIndex, categories]);

  return (
    <div className="relative h-24 w-full flex justify-center items-center overflow-hidden">
      <AnimatePresence>
        {displayCategories.map((category, index) => {
          if (!category) return null;

          const isCenter = index === Math.floor(categories.length / 2);
          const totalItems = categories.length;
          const centerIndex = Math.floor(totalItems / 2);
          const angleSpread = totalItems > 3 ? 120 : 90; 
          const angle = (angleSpread / (totalItems - 1)) * (index - centerIndex);
          const radius = 180;
          
          return (
            <motion.div
              key={category.id}
              layout
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: isCenter ? -10 : 20,
                x: angle,
                zIndex: isCenter ? 10 : 1,
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={() => setActiveTab(category.id)}
              className={cn(
                'absolute cursor-pointer flex flex-col items-center gap-1 group',
                isCenter ? 'text-secondary' : 'text-gray-400 hover:text-white'
              )}
            >
              {category.icon && (
                <category.icon
                  className={cn(
                    'h-6 w-6 transition-all duration-300',
                    isCenter ? 'h-8 w-8 text-secondary' : 'text-gray-500 group-hover:text-white'
                  )}
                />
              )}
              <span
                className={cn(
                  'transition-all duration-300 text-center text-xs',
                  isCenter ? 'font-bold text-base' : 'font-normal'
                )}
              >
                {category.label}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
