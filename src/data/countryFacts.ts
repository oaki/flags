import { Country, Region } from './countries';

const regionPlace = {
  Africa: 'v Afrike',
  Americas: 'v Amerike',
  Antarctic: 'pri Antarktíde',
  Asia: 'v Ázii',
  Europe: 'v Európe',
  Oceania: 'v Oceánii',
} satisfies Record<Region, string>;

const regionStory = {
  Africa: 'V Afrike nájdeš veľa teplých krajín, púšte, rieky, hory aj veľké mestá.',
  Americas: 'V Amerike sú vysoké hory, veľké mestá, ostrovy aj dažďové pralesy.',
  Antarctic: 'Pri Antarktíde je veľa ľadu, snehu a miest, kde býva poriadna zima.',
  Asia: 'Ázia je najväčší kontinent na svete. Žije tam veľmi veľa ľudí.',
  Europe: 'V Európe je veľa krajín blízko pri sebe. Niektoré sú malé, iné veľké.',
  Oceania: 'Oceánia je svet ostrovov, mora, pláží a dlhých ciest cez vodu.',
} satisfies Record<Region, string>;

export const getKidFact = (country: Country) => {
  return `${country.name} leží ${regionPlace[country.region]}. Vlajka pomáha ľuďom spoznať krajinu na mape, v škole aj pri športe.`;
};

export const getCountryStory = (country: Country) => {
  return `${country.name} leží ${regionPlace[country.region]}. ${regionStory[country.region]} Pozri si farby a tvary na vlajke. Pri ďalšej otázke si ich možno ľahšie zapamätáš.`;
};
