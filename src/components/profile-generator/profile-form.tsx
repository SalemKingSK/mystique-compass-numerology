// src/components/profile-generator/profile-form.tsx
'use client';

import * as React from 'react';
import { History, Search } from 'lucide-react';
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { FamousPerson } from '@/lib/famous-birthdays';
import { famousBirthdays } from '@/lib/famous-birthdays';
import InstallButton from '../InstallButton';

interface ProfileFormProps {
  formData: {
    name: string;
    day: number;
    month: number;
    year: number;
    gender: string;
  };
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onHistoryOpen: () => void;
  onSelectChange: (value: string) => void;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFamousPersonSelect: (person: FamousPerson) => void;
}

export function ProfileForm({
  formData,
  isPending,
  onSubmit,
  onHistoryOpen,
  onSelectChange,
  onFieldChange,
  onFamousPersonSelect,
}: ProfileFormProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<FamousPerson[]>([]);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  React.useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const results = famousBirthdays.filter(person =>
        person.name.toLowerCase().includes(lowerCaseQuery) ||
        (person.tags && person.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)))
      );
      setSearchResults(results.slice(0, 50));
      setIsSearchOpen(true); 
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  }, [searchQuery]);

  const handleSelectPerson = (person: FamousPerson) => {
    onFamousPersonSelect(person);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <header className="text-center pt-8">
        <div className="flex justify-center items-center my-4 md:my-0">
            <svg viewBox="0 0 400 150" className="w-full max-w-sm h-auto">
              <defs>
                <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#FDF1B8', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#E8C56D', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#B8860B', stopOpacity: 1 }} />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
              </defs>

              {/* Compass Rose */}
              <g transform="translate(200, 45) scale(0.8)">
                <g filter="url(#glow)">
                    {/* Main points */}
                    <path d="M 0 -40 L 10 0 L -10 0 Z" fill="#FDF1B8"/>
                    <path d="M 0 40 L 10 0 L -10 0 Z" fill="#E8C56D"/>
                    <path d="M 40 0 L 0 10 L 0 -10 Z" fill="#FDF1B8"/>
                    <path d="M -40 0 L 0 10 L 0 -10 Z" fill="#E8C56D"/>
                    {/* Diagonal points */}
                    <path d="M 28 -28 L 5 -5 L -5 5 Z" fill="#E8C56D" />
                    <path d="M 28 28 L 5 5 L -5 -5 Z" fill="#FDF1B8" />
                    <path d="M -28 28 L -5 5 L 5 -5 Z" fill="#E8C56D" />
                    <path d="M -28 -28 L -5 -5 L 5 5 Z" fill="#FDF1B8" />
                </g>
              </g>

              {/* Text */}
              <text
                x="50%"
                y="100"
                dominantBaseline="middle"
                textAnchor="middle"
                fontFamily="Poppins, sans-serif"
                fontSize="48"
                fontWeight="600"
                fill="url(#gold-gradient)"
                letterSpacing="1"
                filter="url(#glow)"
              >
                Mystique
              </text>
              <text
                x="50%"
                y="130"
                dominantBaseline="middle"
                textAnchor="middle"
                fontFamily="Poppins, sans-serif"
                fontSize="24"
                fontWeight="400"
                fill="url(#gold-gradient)"
                letterSpacing="2"
                filter="url(#glow)"
              >
                compass
              </text>
            </svg>
        </div>
        <p className="text-white/70 italic text-sm -mt-2">Giving your life a Meaning.</p>
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
          <div>
            <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <PopoverTrigger asChild>
                <div className="space-y-2">
                  <Label htmlFor="search">Search Famous Person, Country, Sport...</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                    <Input
                      id="search"
                      name="search"
                      placeholder="e.g., Albert Einstein, Tennis, Canada"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onBlur={() => {
                        // We use a timeout to allow click events on the popover to register
                        setTimeout(() => setIsSearchOpen(false), 150);
                      }}
                      onFocus={() => {
                         if (searchResults.length > 0) {
                             setIsSearchOpen(true);
                         }
                      }}
                      className="pl-10"
                      autoComplete="off"
                    />
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
                  {searchResults.length > 0 && (
                      <div className="max-h-60 overflow-y-auto">
                          {searchResults.map((person, index) => (
                          <div
                              key={`${person.name}-${index}`}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelectPerson(person)
                              }}
                              className="p-3 hover:bg-white/10 cursor-pointer text-sm"
                          >
                              {person.name} <span className="text-xs text-white/50">({person.tags.join(', ')})</span>
                          </div>
                          ))}
                      </div>
                  )}
              </PopoverContent>
            </Popover>
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
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col items-center gap-4">
            <Button
              type="submit"
              className="w-full font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              disabled={isPending}
            >
              {isPending ? 'Generating...' : 'Generate Profile'}
            </Button>
            <InstallButton />
          </div>
        </form>
      </div>
      <footer className="text-center p-4 text-white/50 text-xs whitespace-pre-line">
        {"He who knows others is learned;\nHe who knows himself is wise.\nLao Tzu, Dao De Jing"}
      </footer>
    </div>
  );
}
