'use client';

import * as React from 'react';
import { History, Search, Loader2, Globe, Sparkles } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';

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
  const [isWikiLoading, setIsWikiLoading] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const results = famousBirthdays.filter(person =>
        person.name.toLowerCase().includes(lowerCaseQuery) ||
        (person.tags && person.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)))
      );
      setSearchResults(results.slice(0, 20));
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

  const handleWikiSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsWikiLoading(true);
    try {
      const response = await fetch(`/api/biography?name=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if (data.found && data.birthYear && data.birthMonth && data.birthDay) {
        const wikiPerson: FamousPerson = {
          name: data.title,
          day: data.birthDay,
          month: data.birthMonth,
          year: data.birthYear,
          gender: data.gender || 'male',
          tags: ['Wikipedia', data.description].filter(Boolean) as string[],
        };
        handleSelectPerson(wikiPerson);
      } else {
        toast({
          title: "Not Found",
          description: "Could not find precise birth data on Wikipedia for this name.",
        });
      }
    } catch (error) {
      console.error('Wiki search error:', error);
      toast({
        variant: 'destructive',
        title: "Search Error",
        description: "Failed to fetch data from Wikipedia. Please try manual entry.",
      });
    } finally {
      setIsWikiLoading(false);
      setIsSearchOpen(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <header className="text-center pt-8 pb-4">
        <div className="flex justify-center mb-4">
          <InstallButton />
        </div>
        {/* Logo SVG */}
        <div className="flex justify-center items-center my-4">
          <svg viewBox="0 0 400 150" className="w-full max-w-sm h-auto">
            <defs>
              <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#FDF1B8', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#E8C56D', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#B8860B', stopOpacity: 1 }} />
              </linearGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Compass Rose */}
            <g transform="translate(200, 45) scale(0.8)">
              <g filter="url(#glow)">
                <path d="M 0 -40 L 10 0 L -10 0 Z" fill="#FDF1B8" />
                <path d="M 0 40 L 10 0 L -10 0 Z" fill="#E8C56D" />
                <path d="M 40 0 L 0 10 L 0 -10 Z" fill="#FDF1B8" />
                <path d="M -40 0 L 0 10 L 0 -10 Z" fill="#E8C56D" />
                <path d="M 28 -28 L 5 -5 L -5 5 Z" fill="#E8C56D" />
                <path d="M 28 28 L 5 5 L -5 -5 Z" fill="#FDF1B8" />
                <path d="M -28 28 L -5 5 L 5 -5 Z" fill="#E8C56D" />
                <path d="M -28 -28 L -5 -5 L 5 5 Z" fill="#FDF1B8" />
              </g>
            </g>
            <text
              x="50%"
              y="100"
              dominantBaseline="middle"
              textAnchor="middle"
              fontFamily="'Cinzel Decorative', serif"
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
              fontFamily="'Cinzel', serif"
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
        <p className="text-[var(--cf-silver-dim)] italic text-sm font-body">Giving your life a Meaning.</p>
      </header>

      {/* Form */}
      <div className="flex-grow flex items-center justify-center px-1 pb-6">
        <form
          onSubmit={onSubmit}
          className="w-full space-y-5"
          style={{
            background: 'linear-gradient(140deg, rgba(18,30,58,0.97) 0%, rgba(9,16,35,0.98) 100%)',
            border: '1px solid rgba(200,168,75,0.22)',
            borderRadius: '16px',
            padding: '24px 20px',
            boxShadow: '0 0 40px rgba(200,168,75,0.1), inset 0 1px 0 rgba(200,168,75,0.1)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top gold line accent */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(200,168,75,0.7), transparent)',
          }} />

          {/* Header row */}
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="font-cinzel text-[0.55rem] uppercase tracking-[0.3em]" style={{ color: 'var(--cf-gold-dim)' }}>
                ✦ Cosmic Profile Generator ✦
              </p>
            </div>
            <button
              type="button"
              onClick={onHistoryOpen}
              className="p-2 rounded-lg transition-all duration-200"
              style={{
                backgroundColor: 'rgba(200,168,75,0.08)',
                border: '1px solid rgba(200,168,75,0.18)',
                color: 'var(--cf-gold-dim)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(200,168,75,0.15)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--cf-gold)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(200,168,75,0.08)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--cf-gold-dim)';
              }}
            >
              <History className="h-4 w-4" />
              <span className="sr-only">View History</span>
            </button>
          </div>

          {/* Search field */}
          <div>
            <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <PopoverTrigger asChild>
                <div className="space-y-1.5">
                  <label className="font-cinzel uppercase tracking-wider text-[0.55rem]" style={{ color: 'var(--cf-silver-dim)' }}>
                    Search Database or Wikipedia
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: 'var(--cf-silver-dim)' }} />
                    <input
                      id="search"
                      name="search"
                      placeholder="e.g., Albert Einstein, Tesla, Napoleon…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                      onFocus={() => { if (searchQuery.length > 1) setIsSearchOpen(true); }}
                      autoComplete="off"
                      className="w-full pl-9 pr-4 py-2.5 font-body text-sm outline-none transition-all duration-300"
                      style={{
                        backgroundColor: 'rgba(5,9,20,0.88)',
                        border: '1px solid rgba(200,168,75,0.18)',
                        borderRadius: '8px',
                        color: 'var(--cf-text)',
                      }}
                      onFocusCapture={e => {
                        (e.target as HTMLInputElement).style.borderColor = 'var(--cf-gold)';
                        (e.target as HTMLInputElement).style.boxShadow = '0 0 14px rgba(200,168,75,0.18)';
                      }}
                      onBlurCapture={e => {
                        (e.target as HTMLInputElement).style.borderColor = 'rgba(200,168,75,0.18)';
                        (e.target as HTMLInputElement).style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 border-0" onOpenAutoFocus={(e) => e.preventDefault()}
                style={{ background: 'rgba(9,16,35,0.98)', border: '1px solid rgba(200,168,75,0.22)', borderRadius: '10px', boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}>
                <div className="max-h-72 overflow-y-auto">
                  {searchResults.length > 0 && (
                    <div style={{ borderBottom: '1px solid rgba(200,168,75,0.1)' }}>
                      <div className="px-3 py-2 font-cinzel text-[0.5rem] uppercase tracking-widest" style={{ color: 'var(--cf-gold-dim)', background: 'rgba(200,168,75,0.05)' }}>
                        Local Database
                      </div>
                      {searchResults.map((person, index) => (
                        <div
                          key={`${person.name}-${index}`}
                          onMouseDown={(e) => { e.preventDefault(); handleSelectPerson(person); }}
                          className="px-3 py-2.5 cursor-pointer font-body text-sm transition-colors"
                          style={{ color: 'var(--cf-text)' }}
                          onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(200,168,75,0.08)'}
                          onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                        >
                          {person.name}{' '}
                          <span className="font-cinzel text-[0.55rem]" style={{ color: 'var(--cf-silver-dim)' }}>
                            ({person.tags.join(', ')})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div
                    onMouseDown={(e) => { e.preventDefault(); handleWikiSearch(); }}
                    className="px-3 py-3 cursor-pointer font-cinzel text-xs flex items-center gap-2 transition-colors"
                    style={{ color: 'var(--cf-silver)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(200,168,75,0.08)'}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                  >
                    {isWikiLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Globe className="h-3.5 w-3.5" />}
                    {isWikiLoading ? 'Searching Wikipedia…' : `Search Wikipedia for "${searchQuery || '…'}"`}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3" style={{ color: 'var(--cf-gold-dim)', fontSize: '0.6rem', letterSpacing: '0.28em' }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,168,75,0.3), transparent)' }} />
            <span className="font-cinzel uppercase">or enter manually</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,168,75,0.3), transparent)' }} />
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="font-cinzel uppercase tracking-wider text-[0.55rem]" style={{ color: 'var(--cf-silver-dim)' }}>
              Full Name
            </label>
            <input
              id="name"
              name="name"
              placeholder="e.g., Jane Doe"
              value={formData.name}
              onChange={onFieldChange}
              required
              className="w-full px-4 py-2.5 font-body text-sm outline-none transition-all duration-300"
              style={{
                backgroundColor: 'rgba(5,9,20,0.88)',
                border: '1px solid rgba(200,168,75,0.18)',
                borderRadius: '8px',
                color: 'var(--cf-text)',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'var(--cf-gold)';
                e.target.style.boxShadow = '0 0 14px rgba(200,168,75,0.18)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(200,168,75,0.18)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Date row */}
          <div className="grid grid-cols-3 gap-3">
            {([
              { id: 'day', label: 'Day', placeholder: 'DD', min: 1, max: 31 },
              { id: 'month', label: 'Month', placeholder: 'MM', min: 1, max: 12 },
              { id: 'year', label: 'Year', placeholder: 'YYYY', min: 1, max: new Date().getFullYear() },
            ] as const).map(({ id, label, placeholder, min, max }) => (
              <div key={id} className="space-y-1.5">
                <label htmlFor={id} className="font-cinzel uppercase tracking-wider text-[0.55rem]" style={{ color: 'var(--cf-silver-dim)' }}>
                  {label}
                </label>
                <input
                  id={id}
                  name={id}
                  type="number"
                  placeholder={placeholder}
                  value={(formData as any)[id] || ''}
                  onChange={onFieldChange}
                  required
                  min={min}
                  max={max}
                  className="w-full px-3 py-2.5 font-body text-sm outline-none transition-all duration-300 text-center"
                  style={{
                    backgroundColor: 'rgba(5,9,20,0.88)',
                    border: '1px solid rgba(200,168,75,0.18)',
                    borderRadius: '8px',
                    color: 'var(--cf-text)',
                    WebkitAppearance: 'none',
                    MozAppearance: 'textfield',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = 'var(--cf-gold)';
                    e.target.style.boxShadow = '0 0 14px rgba(200,168,75,0.18)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(200,168,75,0.18)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            ))}
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <label className="font-cinzel uppercase tracking-wider text-[0.55rem]" style={{ color: 'var(--cf-silver-dim)' }}>
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) => onSelectChange(e.target.value)}
              required
              className="w-full px-4 py-2.5 font-body text-sm outline-none transition-all duration-300 cursor-pointer"
              style={{
                backgroundColor: 'rgba(5,9,20,0.88)',
                border: '1px solid rgba(200,168,75,0.18)',
                borderRadius: '8px',
                color: formData.gender ? 'var(--cf-text)' : 'var(--cf-text-dim)',
                WebkitAppearance: 'none',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'var(--cf-gold)';
                e.target.style.boxShadow = '0 0 14px rgba(200,168,75,0.18)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(200,168,75,0.18)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="" disabled style={{ background: '#090f1e' }}>Select gender</option>
              <option value="male" style={{ background: '#090f1e' }}>Male</option>
              <option value="female" style={{ background: '#090f1e' }}>Female</option>
            </select>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full font-cinzel font-semibold text-xs tracking-[0.22em] uppercase py-3 px-5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              backgroundImage: isPending
                ? 'linear-gradient(135deg, #4a3818, #8a7030, #4a3818)'
                : 'linear-gradient(135deg, #6a5220, #c8a84b, #6a5220)',
              backgroundColor: isPending ? '#4a3818' : '#6a5220',
              backgroundSize: '200% 100%',
              border: 'none',
              color: 'var(--cf-void)',
              boxShadow: '0 4px 24px rgba(200,168,75,0.28)',
            }}
            onMouseEnter={e => {
              if (!isPending) {
                (e.currentTarget as HTMLButtonElement).style.backgroundPosition = '100% 0';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 36px rgba(200,168,75,0.52)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.backgroundPosition = '0% 0';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 24px rgba(200,168,75,0.28)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'none';
            }}
          >
            {isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Reading the Stars…</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Reveal My Cosmic Profile</span>
              </>
            )}
          </button>

          {/* Bottom gold line accent */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(200,168,75,0.3), transparent)',
          }} />
        </form>
      </div>

      {/* Footer */}
      <footer className="text-center p-4 font-body italic leading-relaxed" style={{ color: 'var(--cf-text-dim)', fontSize: '0.65rem' }}>
        {"He who knows others is learned;\nHe who knows himself is wise.\n— Lao Tzu, Dao De Jing"}
      </footer>
    </div>
  );
}
