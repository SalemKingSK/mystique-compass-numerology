// src/components/profile-generator/profile-form.tsx
'use client';

import * as React from 'react';
import { History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { AstroInsightInput } from './types';

interface ProfileFormProps {
  formData: AstroInsightInput;
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onHistoryOpen: () => void;
  onSelectChange: (value: string) => void;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileForm({
  formData,
  isPending,
  onSubmit,
  onHistoryOpen,
  onSelectChange,
  onFieldChange,
}: ProfileFormProps) {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <header className="text-center pt-8">
          <h1 className="text-4xl font-bold text-white">Mystique Compass</h1>
          <p className="text-white/70 mt-2">Giving your life a meaning.</p>
      </header>
      <div className="flex-grow flex items-center justify-center">
        <form onSubmit={onSubmit} className="space-y-6 w-full glass-card p-6 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
                Generate Profile
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onHistoryOpen}
              className="text-white/70 hover:text-white"
            >
              <History className="h-5 w-5" />
              <span className="sr-only">View History</span>
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Jane Doe"
              value={formData.name}
              onChange={onFieldChange}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="day">Day</Label>
              <Input
                id="day"
                name="day"
                type="number"
                placeholder="DD"
                value={formData.day || ''}
                onChange={onFieldChange}
                required
                min="1"
                max="31"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="month">Month</Label>
              <Input
                id="month"
                name="month"
                type="number"
                placeholder="MM"
                value={formData.month || ''}
                onChange={onFieldChange}
                required
                min="1"
                max="12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                name="year"
                type="number"
                placeholder="YYYY"
                value={formData.year || ''}
                onChange={onFieldChange}
                required
                min="1920"
                max={new Date().getFullYear()}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select onValueChange={onSelectChange} value={formData.gender}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
            disabled={isPending}
          >
            {isPending ? 'Generating...' : 'Generate Profile'}
          </Button>
        </form>
      </div>
      <footer className="text-center p-4 text-white/50 text-xs whitespace-pre-line">
        {"He who knows others is learned;\nHe who knows himself is wise.\nLao Tzu, Dao De Jing"}
      </footer>
    </div>
  );
}