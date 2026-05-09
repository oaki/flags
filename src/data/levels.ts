import { Country, countries } from './countries';

export type Level = {
  id: number;
  title: string;
  subtitle: string;
  targetScore: number;
  questionCount: number;
  countryCodes: string[];
};

const easyCountryCodes = [
  'SK',
  'CZ',
  'US',
  'FR',
  'IT',
  'DE',
  'ES',
  'GB',
  'PL',
  'AT',
];

const knownWorldCodes = [
  'JP',
  'CN',
  'BR',
  'CA',
  'AU',
  'EG',
  'IN',
];

const byRegion = (region: Country['region']) =>
  countries.filter((country) => country.region === region && country.independent).map((country) => country.code);

const beginnerCodes = new Set([...easyCountryCodes, ...byRegion('Europe'), ...knownWorldCodes]);

const expertCodes = countries
  .filter((country) => country.independent && !beginnerCodes.has(country.code))
  .map((country) => country.code);

export const levels: Level[] = [
  {
    id: 1,
    title: 'Ľahké krajiny',
    subtitle: 'Najznámejšie vlajky na istý štart',
    targetScore: 7,
    questionCount: 10,
    countryCodes: easyCountryCodes,
  },
  {
    id: 2,
    title: 'Európa',
    subtitle: 'Všetky európske krajiny',
    targetScore: 7,
    questionCount: 10,
    countryCodes: byRegion('Europe'),
  },
  {
    id: 3,
    title: 'Známy svet',
    subtitle: 'Veľké a často spomínané krajiny mimo Európy',
    targetScore: 7,
    questionCount: 10,
    countryCodes: knownWorldCodes,
  },
  {
    id: 4,
    title: 'Expert',
    subtitle: 'Menšie, vzdialenejšie a menej známe krajiny',
    targetScore: 7,
    questionCount: 10,
    countryCodes: expertCodes,
  },
];

export const maxLevelId = levels[levels.length - 1].id;
