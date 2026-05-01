import { Country, countries } from './countries';

export type Level = {
  id: number;
  title: string;
  subtitle: string;
  targetScore: number;
  questionCount: number;
  countryCodes: string[];
};

const starterCodes = [
  'SK',
  'CZ',
  'PL',
  'HU',
  'AT',
  'DE',
  'FR',
  'IT',
  'ES',
  'GB',
  'IE',
  'US',
  'CA',
  'BR',
  'MX',
  'JP',
  'CN',
  'IN',
  'AU',
  'ZA',
];

const byRegion = (region: Country['region']) =>
  countries.filter((country) => country.region === region && country.independent).map((country) => country.code);

const territories = countries
  .filter((country) => !country.independent || !country.unMember)
  .map((country) => country.code);

export const levels: Level[] = [
  {
    id: 1,
    title: 'Prvé vlajky',
    subtitle: 'Známe krajiny na ľahký štart',
    targetScore: 7,
    questionCount: 10,
    countryCodes: starterCodes,
  },
  {
    id: 2,
    title: 'Európa',
    subtitle: 'Krajiny blízko nás',
    targetScore: 7,
    questionCount: 10,
    countryCodes: byRegion('Europe'),
  },
  {
    id: 3,
    title: 'Amerika',
    subtitle: 'Sever, stred aj juh Ameriky',
    targetScore: 7,
    questionCount: 10,
    countryCodes: byRegion('Americas'),
  },
  {
    id: 4,
    title: 'Ázia',
    subtitle: 'Veľký svet plný farieb',
    targetScore: 7,
    questionCount: 10,
    countryCodes: byRegion('Asia'),
  },
  {
    id: 5,
    title: 'Afrika',
    subtitle: 'Slnko, savany a nové vlajky',
    targetScore: 7,
    questionCount: 10,
    countryCodes: byRegion('Africa'),
  },
  {
    id: 6,
    title: 'Oceánia',
    subtitle: 'Ostrovy, more a hviezdy',
    targetScore: 7,
    questionCount: 10,
    countryCodes: byRegion('Oceania'),
  },
  {
    id: 7,
    title: 'Tajné miesta',
    subtitle: 'Vlajky pre malých majstrov',
    targetScore: 7,
    questionCount: 10,
    countryCodes: territories,
  },
  {
    id: 8,
    title: 'Celý svet',
    subtitle: `${countries.length} vlajok v jednej výzve`,
    targetScore: 8,
    questionCount: 12,
    countryCodes: countries.map((country) => country.code),
  },
];

export const maxLevelId = levels[levels.length - 1].id;
