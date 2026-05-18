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

const expertFocusCodes = [
  'AD',
  'LI',
  'SM',
  'MC',
  'VA',
  'MT',
  'IS',
  'BH',
  'BT',
  'BN',
  'MV',
  'TL',
  'DJ',
  'KM',
  'CV',
  'ST',
  'SC',
  'GM',
  'LS',
  'SZ',
  'BB',
  'BS',
  'BZ',
  'DM',
  'GD',
  'LC',
  'KN',
  'VC',
  'SR',
  'FJ',
  'KI',
  'MH',
  'FM',
  'NR',
  'PW',
  'SB',
  'TO',
  'TV',
  'VU',
];

const byRegion = (region: Country['region']) =>
  countries.filter((country) => country.region === region && country.independent).map((country) => country.code);

const bonusFlagCodes = countries.filter((country) => !country.independent).map((country) => country.code);

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
    title: 'Ázia',
    subtitle: 'Od Japonska po Blízky východ',
    targetScore: 8,
    questionCount: 12,
    countryCodes: byRegion('Asia'),
  },
  {
    id: 5,
    title: 'Afrika',
    subtitle: 'Veľký kontinent plný nových vlajok',
    targetScore: 8,
    questionCount: 12,
    countryCodes: byRegion('Africa'),
  },
  {
    id: 6,
    title: 'Amerika',
    subtitle: 'Severná, Stredná a Južná Amerika',
    targetScore: 8,
    questionCount: 12,
    countryCodes: byRegion('Americas'),
  },
  {
    id: 7,
    title: 'Oceánia',
    subtitle: 'Austrália a ostrovné krajiny Pacifiku',
    targetScore: 7,
    questionCount: 10,
    countryCodes: byRegion('Oceania'),
  },
  {
    id: 8,
    title: 'Expert mix',
    subtitle: 'Malé štáty a vlajky, ktoré sa ľahko prehliadnu',
    targetScore: 8,
    questionCount: 12,
    countryCodes: expertFocusCodes,
  },
  {
    id: 9,
    title: 'Bonus vlajky',
    subtitle: 'Územia a špeciálne vlajky do albumu',
    targetScore: 8,
    questionCount: 12,
    countryCodes: bonusFlagCodes,
  },
];

export const maxLevelId = levels[levels.length - 1].id;
