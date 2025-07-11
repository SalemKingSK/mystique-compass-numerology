
'use client'

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type ChecklistProps = {
    items: string[];
};

export function Checklist({ items }: ChecklistProps) {
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

    const handleCheckedChange = (item: string, checked: boolean | 'indeterminate') => {
        setCheckedItems(prev => {
            const newSet = new Set(prev);
            if (checked) {
                newSet.add(item);
            } else {
                newSet.delete(item);
            }
            return newSet;
        });
    };

    if (!items || items.length === 0) {
        return null;
    }

    return (
        <div className="space-y-3">
             <AnimatePresence>
                {items.map((item, index) => {
                    const isChecked = checkedItems.has(item);
                    return (
                        <motion.div
                            key={item}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            className="flex items-start space-x-3 rounded-lg p-3 transition-colors duration-200 hover:bg-secondary/50"
                        >
                            <Checkbox
                                id={`item-${index}`}
                                checked={isChecked}
                                onCheckedChange={(checked) => handleCheckedChange(item, checked)}
                                className="mt-1"
                                aria-labelledby={`label-${index}`}
                            />
                            <Label
                                id={`label-${index}`}
                                htmlFor={`item-${index}`}
                                className={cn(
                                    "text-sm font-medium leading-relaxed cursor-pointer transition-all w-full",
                                    isChecked ? "line-through text-muted-foreground" : "text-card-foreground"
                                )}
                            >
                                {item}
                            </Label>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
