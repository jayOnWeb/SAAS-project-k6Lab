import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AnimatedList.css';

export default function AnimatedList({
  items = [],
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  displayScrollbar = false,
  className = '',
  itemClassName = '',
  renderItem,
  maxHeight = '480px',
  initialSelectedIndex = -1
}) {
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
  const [keyboardFocusedIndex, setKeyboardFocusedIndex] = useState(-1);
  const listRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, items.length);
  }, [items]);

  const handleKeyDown = (e) => {
    if (!enableArrowNavigation || items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setKeyboardFocusedIndex((prev) => {
        const next = prev < items.length - 1 ? prev + 1 : 0;
        itemRefs.current[next]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setKeyboardFocusedIndex((prev) => {
        const next = prev > 0 ? prev - 1 : items.length - 1;
        itemRefs.current[next]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        return next;
      });
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (keyboardFocusedIndex >= 0 && keyboardFocusedIndex < items.length) {
        e.preventDefault();
        handleSelect(items[keyboardFocusedIndex], keyboardFocusedIndex);
      }
    }
  };

  const handleSelect = (item, index) => {
    setSelectedIndex(index);
    setKeyboardFocusedIndex(index);
    if (onItemSelect) {
      onItemSelect(item, index);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.98 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring', stiffness: 350, damping: 25 } 
    }
  };

  return (
    <div className={`animated-list-container ${className}`}>
      {showGradients && <div className="animated-list-gradient-top" />}

      <div
        ref={listRef}
        tabIndex={enableArrowNavigation ? 0 : -1}
        onKeyDown={handleKeyDown}
        style={{ maxHeight }}
        className={`animated-list-scroll ${displayScrollbar ? 'with-scrollbar' : 'no-scrollbar'}`}
      >
        <motion.ul
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-2.5 p-1 m-0 list-none"
        >
          <AnimatePresence>
            {items.map((item, index) => {
              const isSelected = selectedIndex === index;
              const isKeyboardFocused = keyboardFocusedIndex === index;

              return (
                <motion.li
                  key={item._id || item.id || index}
                  ref={(el) => (itemRefs.current[index] = el)}
                  variants={itemVariants}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelect(item, index)}
                  className={`animated-list-item cursor-pointer rounded-xl border p-3.5 transition-all duration-200 ${
                    isSelected
                      ? 'animated-list-item--selected border-red-500/50 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                      : isKeyboardFocused
                      ? 'border-red-500/40 bg-zinc-900 shadow-[0_0_12px_rgba(239,68,68,0.1)]'
                      : 'border-zinc-800/80 bg-zinc-900/40 hover:border-red-500/30 hover:bg-zinc-900/90 hover:shadow-[0_0_15px_rgba(239,68,68,0.08)]'
                  } ${itemClassName}`}
                >
                  {renderItem ? (
                    renderItem(item, index, isSelected)
                  ) : typeof item === 'string' || typeof item === 'number' ? (
                    <span className="text-sm text-zinc-200 font-sans">{item}</span>
                  ) : (
                    <div className="flex items-center justify-between gap-3 text-xs font-mono">
                      <span className="text-zinc-200 font-semibold truncate">{item.name || item.title || JSON.stringify(item)}</span>
                    </div>
                  )}
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      </div>

      {showGradients && <div className="animated-list-gradient-bottom" />}
    </div>
  );
}
