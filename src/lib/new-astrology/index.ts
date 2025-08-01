// src/lib/new-astrology/index.ts

import { aries } from './aries';
import { taurus } from './taurus';
import { gemini } from './gemini';
import { cancer } from './cancer';
import { leo } from './leo';
import { virgo } from './virgo';
import { libra } from './libra';
import { scorpio } from './scorpio';
import { sagittarius } from './sagittarius';
import { capricorn } from './capricorn';
import { aquarius } from './aquarius';
import { pisces } from './pisces';

interface NewAstrologySign {
  description: string;
  love: string;
  compatibilities: string;
  homeAndFamily: string;
  profession: string;
}

export const NEW_ASTROLOGY_DATA: { [key: string]: NewAstrologySign } = {
  ...aries,
  ...taurus,
  ...gemini,
  ...cancer,
  ...leo,
  ...virgo,
  ...libra,
  ...scorpio,
  ...sagittarius,
  ...capricorn,
  ...aquarius,
  ...pisces,
};
