import countryData from './countries.generated.json';

export type Region = 'Africa' | 'Americas' | 'Antarctic' | 'Asia' | 'Europe' | 'Oceania';

export type Country = {
  code: string;
  name: string;
  officialName: string;
  region: Region;
  subregion: string;
  independent: boolean;
  unMember: boolean;
  flagUrl: string;
  flagUrlLarge: string;
};

export const countries = countryData as Country[];

export const getCountryByCode = (code: string) =>
  countries.find((country) => country.code === code);
