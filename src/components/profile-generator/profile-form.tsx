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
  const searchInputRef = React.useRef<HTMLInputElement>(null);

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
        <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-500">Mystique Compass</h1>
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
                      ref={searchInputRef}
                      placeholder="e.g., Albert Einstein, Tennis, Canada"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      autoComplete="off"
                    />
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
                  {searchResults.length > 0 ? (
                      <div className="max-h-60 overflow-y-auto">
                          {searchResults.map((person) => (
                          <div
                              key={person.name}
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
                  ) : (
                       <div className="p-3 text-sm text-center text-white/50">No results found.</div>
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
        {"He who knows others is learned;\\nHe who knows himself is wise.\\nLao Tzu, Dao De Jing"}
      </footer>
    </div>
  );
}
