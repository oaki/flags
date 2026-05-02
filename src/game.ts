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

export const europeMapShapes = [
  { code: 'IS', d: 'M88 40 L132 34 L150 58 L128 82 L84 74 L68 52 Z', labelX: 110, labelY: 60 },
  { code: 'IE', d: 'M80 206 L118 190 L142 216 L128 256 L86 258 L66 232 Z', labelX: 104, labelY: 226 },
  { code: 'GB', d: 'M154 164 L208 146 L238 184 L226 244 L182 270 L142 232 Z', labelX: 190, labelY: 210 },
  { code: 'NO', d: 'M324 56 L390 34 L434 72 L420 156 L362 186 L318 140 Z', labelX: 374, labelY: 106 },
  { code: 'SE', d: 'M430 82 L492 58 L542 104 L522 224 L464 240 L420 158 Z', labelX: 476, labelY: 158 },
  { code: 'FI', d: 'M544 74 L626 70 L670 130 L636 226 L540 220 L558 144 Z', labelX: 604, labelY: 150 },
  { code: 'DK', d: 'M360 238 L410 224 L438 254 L410 286 L362 278 Z', labelX: 396, labelY: 256 },
  { code: 'NL', d: 'M296 292 L348 284 L366 326 L332 360 L286 342 Z', labelX: 326, labelY: 320 },
  { code: 'BE', d: 'M306 362 L366 344 L396 386 L360 430 L300 414 Z', labelX: 348, labelY: 390 },
  { code: 'FR', d: 'M214 406 L352 398 L424 466 L390 594 L270 638 L162 570 L150 464 Z', labelX: 296, labelY: 512 },
  { code: 'ES', d: 'M118 628 L280 636 L328 734 L220 814 L84 762 L46 670 Z', labelX: 200, labelY: 708 },
  { code: 'DE', d: 'M392 304 L494 292 L542 382 L512 486 L414 468 L364 386 Z', labelX: 456, labelY: 390 },
  { code: 'PL', d: 'M536 292 L682 300 L734 386 L684 472 L526 454 L504 362 Z', labelX: 622, labelY: 384 },
  { code: 'CZ', d: 'M438 484 L536 466 L594 510 L546 566 L438 552 L398 514 Z', labelX: 500, labelY: 518 },
  { code: 'AT', d: 'M402 568 L534 568 L586 616 L536 672 L400 650 L362 606 Z', labelX: 482, labelY: 616 },
  { code: 'SK', d: 'M590 532 L684 514 L732 558 L692 614 L588 600 L550 560 Z', labelX: 644, labelY: 562 },
  { code: 'HU', d: 'M558 622 L694 622 L750 676 L692 734 L552 710 L518 662 Z', labelX: 636, labelY: 674 },
  { code: 'IT', d: 'M414 684 L506 684 L560 792 L626 868 L578 938 L498 844 L434 812 Z', labelX: 512, labelY: 786 },
  { code: 'RO', d: 'M720 650 L856 630 L932 704 L884 808 L724 786 L674 712 Z', labelX: 802, labelY: 718 },
  { code: 'GR', d: 'M676 838 L784 812 L866 878 L826 944 L700 938 L638 884 Z', labelX: 752, labelY: 884 },
  { code: 'UA', d: 'M740 438 L956 428 L1038 548 L946 650 L744 612 L692 516 Z', labelX: 866, labelY: 536 },
] satisfies { code: string; d: string; labelX: number; labelY: number }[];

export const europeMapPoints = europeMapShapes.map((shape) => ({
  code: shape.code,
  x: (shape.labelX / 1080) * 100,
  y: (shape.labelY / 980) * 100,
}));

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

const pickDistractors = (answer: Country, pool: Country[], optionCount: number, mode: GameMode) => {
  const similar = getSimilarCodes(answer.code)
    .filter((code) => code !== answer.code)
    .map((code) => getCountryByCode(code))
    .filter((country): country is Country => Boolean(country));
  const sameRegion = pool.filter((country) => country.code !== answer.code && country.region === answer.region);
  const backup = countries.filter((country) => country.code !== answer.code);
  const paintPool = pool.filter((country) => flagPalettes[country.code]);
  const mapPool = pool.filter((country) => europeMapPoints.some((point) => point.code === country.code));
  const preferred =
    mode === 'similar'
      ? [...similar, ...sameRegion]
      : mode === 'paint'
        ? [...paintPool, ...sameRegion]
        : mode === 'map'
          ? [...mapPool, ...sameRegion]
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
    const mappableCodes = new Set(europeMapPoints.map((point) => point.code));
    const mapPool = pool.filter((country) => mappableCodes.has(country.code));
    return mapPool.length >= 4 ? mapPool : pool;
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
  if (settings.mode === 'map' && europeMapPoints.some((point) => point.code === country.code)) weight += 3;
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
