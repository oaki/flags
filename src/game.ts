import { Country, countries, getCountryByCode } from './data/countries';
import { Level } from './data/levels';

export type Difficulty = 'baby' | 'junior' | 'master';
export type GameMode = 'journey' | 'country' | 'map' | 'similar' | 'paint';

export type FlagPalette = {
  orientation: 'horizontal' | 'vertical' | 'cross' | 'symbol';
  colors: string[];
  labels: string[];
};

export type Question = {
  answer: Country;
  options: Country[];
  hint: string;
  mode: GameMode;
};

export type QuestionSettings = {
  difficulty: Difficulty;
  mode: GameMode;
  weakCountryCodes?: string[];
  discoveredCountryCodes?: string[];
};

export const difficultyOptions = {
  baby: 2,
  junior: 3,
  master: 4,
} satisfies Record<Difficulty, number>;

const similarFlagGroups = [
  ['SK', 'SI', 'RU', 'RS', 'HR'],
  ['IE', 'CI', 'IT', 'HU'],
  ['RO', 'TD', 'AD', 'MD'],
  ['MC', 'ID', 'PL'],
  ['NL', 'LU', 'RU'],
  ['SE', 'FI', 'NO', 'DK', 'IS'],
  ['AT', 'LV', 'LB'],
  ['GB', 'AU', 'NZ', 'FJ'],
];

export const europeMapPoints = [
  { code: 'IS', x: 15, y: 15 },
  { code: 'IE', x: 24, y: 45 },
  { code: 'GB', x: 31, y: 39 },
  { code: 'NO', x: 48, y: 19 },
  { code: 'SE', x: 57, y: 29 },
  { code: 'FI', x: 68, y: 25 },
  { code: 'DK', x: 47, y: 43 },
  { code: 'NL', x: 42, y: 51 },
  { code: 'BE', x: 41, y: 55 },
  { code: 'FR', x: 37, y: 64 },
  { code: 'ES', x: 30, y: 79 },
  { code: 'DE', x: 50, y: 53 },
  { code: 'PL', x: 61, y: 53 },
  { code: 'CZ', x: 53, y: 59 },
  { code: 'AT', x: 52, y: 64 },
  { code: 'SK', x: 59, y: 61 },
  { code: 'HU', x: 60, y: 67 },
  { code: 'IT', x: 52, y: 76 },
  { code: 'RO', x: 70, y: 69 },
  { code: 'GR', x: 67, y: 87 },
  { code: 'UA', x: 76, y: 59 },
] satisfies { code: string; x: number; y: number }[];

const flagPalettes: Record<string, FlagPalette> = {
  SK: { orientation: 'horizontal', colors: ['#ffffff', '#1d4ed8', '#dc2626'], labels: ['biela', 'modrá', 'červená'] },
  CZ: { orientation: 'symbol', colors: ['#ffffff', '#dc2626', '#2563eb'], labels: ['biela', 'červená', 'modrý klin'] },
  PL: { orientation: 'horizontal', colors: ['#ffffff', '#dc2626'], labels: ['biela', 'červená'] },
  HU: { orientation: 'horizontal', colors: ['#dc2626', '#ffffff', '#16a34a'], labels: ['červená', 'biela', 'zelená'] },
  AT: { orientation: 'horizontal', colors: ['#dc2626', '#ffffff', '#dc2626'], labels: ['červená', 'biela', 'červená'] },
  DE: { orientation: 'horizontal', colors: ['#111827', '#dc2626', '#facc15'], labels: ['čierna', 'červená', 'žltá'] },
  FR: { orientation: 'vertical', colors: ['#1d4ed8', '#ffffff', '#dc2626'], labels: ['modrá', 'biela', 'červená'] },
  IT: { orientation: 'vertical', colors: ['#16a34a', '#ffffff', '#dc2626'], labels: ['zelená', 'biela', 'červená'] },
  IE: { orientation: 'vertical', colors: ['#16a34a', '#ffffff', '#f97316'], labels: ['zelená', 'biela', 'oranžová'] },
  NL: { orientation: 'horizontal', colors: ['#dc2626', '#ffffff', '#2563eb'], labels: ['červená', 'biela', 'modrá'] },
  LU: { orientation: 'horizontal', colors: ['#dc2626', '#ffffff', '#38bdf8'], labels: ['červená', 'biela', 'svetlomodrá'] },
  RO: { orientation: 'vertical', colors: ['#1d4ed8', '#facc15', '#dc2626'], labels: ['modrá', 'žltá', 'červená'] },
  BE: { orientation: 'vertical', colors: ['#111827', '#facc15', '#dc2626'], labels: ['čierna', 'žltá', 'červená'] },
  ES: { orientation: 'horizontal', colors: ['#dc2626', '#facc15', '#dc2626'], labels: ['červená', 'žltá', 'červená'] },
  UA: { orientation: 'horizontal', colors: ['#2563eb', '#facc15'], labels: ['modrá', 'žltá'] },
  SE: { orientation: 'cross', colors: ['#2563eb', '#facc15'], labels: ['modrá', 'žltý kríž'] },
  FI: { orientation: 'cross', colors: ['#ffffff', '#2563eb'], labels: ['biela', 'modrý kríž'] },
  DK: { orientation: 'cross', colors: ['#dc2626', '#ffffff'], labels: ['červená', 'biely kríž'] },
  NO: { orientation: 'cross', colors: ['#dc2626', '#ffffff', '#1d4ed8'], labels: ['červená', 'biely okraj', 'modrý kríž'] },
  IS: { orientation: 'cross', colors: ['#2563eb', '#ffffff', '#dc2626'], labels: ['modrá', 'biely okraj', 'červený kríž'] },
};

const countryHints: Record<string, string> = {
  SK: 'Má bielo-modro-červené pruhy a znak s dvojkrížom.',
  SI: 'Je podobná Slovensku, ale znak má hory a more.',
  RU: 'Má tri vodorovné pruhy bez znaku.',
  RS: 'Má tri vodorovné pruhy a veľký znak pri žrdi.',
  HR: 'Na šachovnicový znak si dávaj veľký pozor.',
  IE: 'Zelený pruh je pri žrdi a oranžový na konci.',
  CI: 'Oranžový pruh je pri žrdi a zelený na konci.',
  IT: 'Má zelený, biely a červený zvislý pruh.',
  HU: 'Má červený, biely a zelený vodorovný pruh.',
  RO: 'Má modrý, žltý a červený zvislý pruh.',
  TD: 'Je veľmi podobná Rumunsku, ale modrá je tmavšia.',
  AD: 'Má uprostred zvislých pruhov znak.',
  MD: 'Má v strede znak s orlom.',
  MC: 'Má len dva vodorovné pruhy: červený a biely.',
  ID: 'Je ako Monako, ale patrí veľkej ostrovnej krajine.',
  PL: 'Biela je hore a červená dole.',
  NL: 'Červená, biela a modrá sú vodorovné.',
  LU: 'Vyzerá ako Holandsko, ale modrá je svetlejšia.',
  SE: 'Modré pozadie a žltý severský kríž.',
  FI: 'Biele pozadie a modrý severský kríž.',
  NO: 'Červené pozadie, modrý kríž s bielym okrajom.',
  DK: 'Červené pozadie a biely severský kríž.',
  IS: 'Modré pozadie, červený kríž s bielym okrajom.',
  AT: 'Červená, biela, červená v troch vodorovných pruhoch.',
  LV: 'Tmavočervené pruhy s tenkým bielym pásom uprostred.',
  GB: 'Spája viac krížov do jednej vlajky.',
  AU: 'Má britskú vlajku v rohu a veľké hviezdy.',
  NZ: 'Má britskú vlajku v rohu a červené hviezdy.',
};

export const getFlagPalette = (code: string) => flagPalettes[code];

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
};

const getSimilarCodes = (code: string) => similarFlagGroups.find((group) => group.includes(code)) || [];
const unmappableCountryCodes = new Set([
  'AX',
  'BQ',
  'BV',
  'IO',
  'CW',
  'TF',
  'HM',
  'HK',
  'GS',
  'SS',
  'CC',
  'MO',
  'UM',
  'NF',
  'SX',
  'SJ',
  'TK',
  'CX',
]);
const isMappableCountry = (country: Country) => !unmappableCountryCodes.has(country.code);

const pickDistractors = (answer: Country, pool: Country[], optionCount: number, mode: GameMode) => {
  const similar = getSimilarCodes(answer.code)
    .filter((code) => code !== answer.code)
    .map((code) => getCountryByCode(code))
    .filter((country): country is Country => Boolean(country));
  const sameRegion = pool.filter((country) => country.code !== answer.code && country.region === answer.region);
  const backup = countries.filter((country) => country.code !== answer.code && (mode !== 'map' || isMappableCountry(country)));
  const paintPool = pool.filter((country) => flagPalettes[country.code]);
  const mapPool = pool.filter(isMappableCountry);
  const preferred =
    mode === 'similar'
      ? [...similar, ...sameRegion]
      : mode === 'paint'
        ? [...paintPool, ...sameRegion]
        : mode === 'map'
          ? [...mapPool, ...sameRegion.filter(isMappableCountry), ...similar.filter(isMappableCountry)]
          : [...sameRegion, ...similar];

  return shuffle([...preferred, ...backup])
    .filter((country, index, list) => list.findIndex((item) => item.code === country.code) === index)
    .slice(0, optionCount - 1);
};

const buildQuestionPool = (level: Level, settings: QuestionSettings) => {
  const pool = level.countryCodes
    .map((code) => getCountryByCode(code))
    .filter((country): country is Country => Boolean(country));

  if (settings.mode === 'paint') {
    const paintPool = pool.filter((country) => flagPalettes[country.code]);
    return paintPool.length >= 4 ? paintPool : pool;
  }

  if (settings.mode === 'map') {
    return pool.filter(isMappableCountry);
  }

  if (settings.mode !== 'similar') return pool;

  const similarCodes = new Set(similarFlagGroups.flat());
  const similarPool = pool.filter((country) => similarCodes.has(country.code));
  return similarPool.length >= 4 ? similarPool : pool;
};

const weightCountry = (country: Country, settings: QuestionSettings) => {
  let weight = 1;
  if (settings.weakCountryCodes?.includes(country.code)) weight += 5;
  if (!settings.discoveredCountryCodes?.includes(country.code)) weight += 2;
  if (settings.mode === 'similar' && getSimilarCodes(country.code).length > 0) weight += 2;
  if (settings.mode === 'paint' && flagPalettes[country.code]) weight += 3;
  if (settings.mode === 'map') weight += 2;
  return weight;
};

const weightedShuffle = (pool: Country[], settings: QuestionSettings) =>
  [...pool].sort(() => Math.random() - 0.5).sort((a, b) => weightCountry(b, settings) - weightCountry(a, settings));

const getHint = (answer: Country, mode: GameMode) => {
  if (countryHints[answer.code]) return countryHints[answer.code];
  if (mode === 'paint') return 'Vyber farebné rozloženie vlajky. Poradie farieb je dôležité.';
  if (mode === 'country') return 'Pozri sa na názov krajiny a vyber vlajku, ktorá k nej patrí.';
  if (mode === 'map') return 'Nájdi krajinu na mape. Pomôže ti jej poloha medzi susedmi.';
  if (mode === 'similar') return 'Všímaj si poradie farieb, smer pruhov a malé znaky na vlajke.';
  if (answer.region === 'Europe') return 'Táto krajina je v Európe. Skús si všimnúť farby a znak.';
  return `Táto krajina leží v regióne ${answer.region}. Hľadaj výrazný tvar alebo farby.`;
};

export const createQuestions = (level: Level, settings: QuestionSettings): Question[] => {
  const pool = buildQuestionPool(level, settings);
  const optionCount = difficultyOptions[settings.difficulty];

  return weightedShuffle(pool, settings)
    .slice(0, level.questionCount)
    .map((answer) => ({
      answer,
      options: shuffle([answer, ...pickDistractors(answer, pool, optionCount, settings.mode)]),
      hint: getHint(answer, settings.mode),
      mode: settings.mode,
    }));
};
