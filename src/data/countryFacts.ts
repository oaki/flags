import { Country, Region } from './countries';

type FactCopy = {
  country: string;
  flag: string;
};

const regionLens = {
  Africa: 'Všímaj si, či je krajina pri mori, v púšti, pri veľkej rieke alebo vo vnútrozemí.',
  Americas: 'Skús si zapamätať, či patrí do Severnej, Strednej alebo Južnej Ameriky.',
  Antarctic: 'Pri antarktických územiach pomáha zapamätať si najmä ľad, more a vedecké stanice.',
  Asia: 'Ázia je obrovská, preto pomáha deliť si ju na menšie časti podľa subregiónov.',
  Europe: 'V Európe sú krajiny blízko pri sebe, preto pomáha porovnávať susedov.',
  Oceania: 'V Oceánii veľa vlajok patrí ostrovom, kde je dôležité more, hviezdy a dlhé vzdialenosti.',
} satisfies Record<Region, string>;

const factsByCode: Record<string, FactCopy> = {
  AD: {
    country: 'Andorra leží vysoko v Pyrenejach medzi Francúzskom a Španielskom.',
    flag: 'Na vlajke má zvislé pruhy a znak v strede, preto si ju nepleť s jednoduchými trojfarebnými vlajkami.',
  },
  AT: {
    country: 'Rakúsko je náš sused a jeho hlavné mesto Viedeň leží blízko Slovenska.',
    flag: 'Rakúska vlajka má jednoduchý vzor červená, biela, červená. Biela je uprostred ako široký pás.',
  },
  AU: {
    country: 'Austrália je zároveň krajina aj kontinent, čo je pri štátoch veľmi nezvyčajné.',
    flag: 'V rohu má britskú vlajku a na modrom poli hviezdy, ktoré pripomínajú južnú oblohu.',
  },
  BD: {
    country: 'Bangladéš leží pri veľkej delte riek, kde sa voda vetví do mnohých ramien.',
    flag: 'Červený kruh nie je celkom v strede. Na zelenom podklade si ho ľahko zapamätáš.',
  },
  BE: {
    country: 'Belgicko je známe Bruselom, kde sídli veľa európskych inštitúcií.',
    flag: 'Belgická vlajka má zvislé pruhy čierna, žltá, červená. Čierna je pri žrdi.',
  },
  BR: {
    country: 'Brazília je najväčšia krajina Južnej Ameriky a preteká ňou rieka Amazonka.',
    flag: 'Zelené pole, žltý kosoštvorec a modrý kruh robia z brazílskej vlajky jednu z najľahšie rozpoznateľných.',
  },
  CA: {
    country: 'Kanada je obrovská krajina so studeným severom, veľkými jazerami a množstvom lesov.',
    flag: 'Javorový list v strede je hlavný poznávací znak. Pri tejto vlajke nehľadaj pruhy, ale list.',
  },
  CI: {
    country: 'Pobrežie Slonoviny leží v západnej Afrike pri Atlantickom oceáne.',
    flag: 'Je podobná Írsku, ale oranžový pruh je pri žrdi a zelený na konci.',
  },
  CN: {
    country: 'Čína má najviac obyvateľov medzi najväčšími krajinami sveta a veľa starých vynálezov pochádza odtiaľ.',
    flag: 'Červené pole a žlté hviezdy sú jasný signál. Veľká hviezda je pri žrdi.',
  },
  CZ: {
    country: 'Česko je náš západný sused a s češtinou si Slováci často rozumejú.',
    flag: 'Česká vlajka má modrý klin pri žrdi. To je detail, ktorý ju odlišuje od poľskej vlajky.',
  },
  DE: {
    country: 'Nemecko je jedna z najväčších krajín Európy a má veľa veľkých miest.',
    flag: 'Tri vodorovné pruhy idú zhora nadol čierna, červená, žltá.',
  },
  DK: {
    country: 'Dánsko tvorí polostrov a mnoho ostrovov medzi Severným a Baltským morom.',
    flag: 'Biely severský kríž na červenom poli je vzor, ktorý inšpiroval aj ďalšie severské vlajky.',
  },
  ES: {
    country: 'Španielsko leží na Pyrenejskom polostrove a má veľa slnečných pobreží.',
    flag: 'Žltý pás uprostred je širší než červené pásy hore a dole.',
  },
  FI: {
    country: 'Fínsko je známe tisíckami jazier a dlhými zimami na severe.',
    flag: 'Modrý severský kríž na bielom pozadí pripomína vodu a sneh.',
  },
  FJ: {
    country: 'Fidži je ostrovná krajina v Tichom oceáne.',
    flag: 'Svetlomodré pole pripomína more a v rohu má britskú vlajku.',
  },
  FR: {
    country: 'Francúzsko je známe Parížom, Eiffelovou vežou a dlhým pobrežím pri dvoch moriach.',
    flag: 'Francúzska trikolóra má zvislé pruhy modrá, biela, červená.',
  },
  GB: {
    country: 'Spojené kráľovstvo tvoria Anglicko, Škótsko, Wales a Severné Írsko.',
    flag: 'Union Jack spája viac krížov do jedného vzoru. Preto vyzerá zložitejšie než väčšina vlajok.',
  },
  HR: {
    country: 'Chorvátsko má dlhé pobrežie pri Jadranskom mori a veľa ostrovov.',
    flag: 'Šachovnicový znak v strede je najlepší detail na zapamätanie.',
  },
  HU: {
    country: 'Maďarsko je náš južný sused a jeho hlavné mesto Budapešť leží na Dunaji.',
    flag: 'Tri vodorovné pruhy idú červená, biela, zelená. Zelená je dole.',
  },
  ID: {
    country: 'Indonézia je krajina tisícov ostrovov v juhovýchodnej Ázii.',
    flag: 'Má dva jednoduché pruhy: červený hore a biely dole. Je podobná Monaku.',
  },
  IE: {
    country: 'Írsko je ostrovná krajina na západe Európy, známa zelenou krajinou.',
    flag: 'Zelený pruh je pri žrdi, biely v strede a oranžový na konci.',
  },
  IS: {
    country: 'Island má sopky, ľadovce a gejzíry, teda horúcu vodu aj veľa ľadu na jednom ostrove.',
    flag: 'Modré pole s bielym a červeným krížom patrí medzi severské krížové vlajky.',
  },
  IT: {
    country: 'Taliansko má tvar čižmy a patrí k nemu aj veľa známych miest ako Rím či Benátky.',
    flag: 'Zvislé pruhy idú zelená, biela, červená. Zelená je pri žrdi.',
  },
  JP: {
    country: 'Japonsko je ostrovná krajina vo východnej Ázii.',
    flag: 'Červený kruh na bielom poli pripomína slnko, preto sa Japonsku často hovorí krajina vychádzajúceho slnka.',
  },
  LB: {
    country: 'Libanon leží pri Stredozemnom mori na západe Ázie.',
    flag: 'Céder v strede je strom, podľa ktorého si libanonskú vlajku ľahko zapamätáš.',
  },
  LU: {
    country: 'Luxembursko je malá krajina medzi Belgickom, Francúzskom a Nemeckom.',
    flag: 'Vyzerá podobne ako holandská, ale spodná modrá je svetlejšia.',
  },
  LV: {
    country: 'Lotyšsko leží pri Baltskom mori medzi Estónskom a Litvou.',
    flag: 'Má tmavočervené pruhy a úzky biely pás v strede.',
  },
  MC: {
    country: 'Monako je veľmi malá krajina pri Stredozemnom mori.',
    flag: 'Má len dva pruhy: červený hore a biely dole. Je podobná Indonézii.',
  },
  MD: {
    country: 'Moldavsko leží medzi Rumunskom a Ukrajinou.',
    flag: 'Má modrý, žltý a červený pruh, ale v strede je znak s orlom.',
  },
  MX: {
    country: 'Mexiko leží medzi Spojenými štátmi a Strednou Amerikou.',
    flag: 'V strede vlajky je znak s orlom, ktorý pomáha odlíšiť ju od talianskej trikolóry.',
  },
  NL: {
    country: 'Holandsko je známe kanálmi, veternými mlynmi a nížinami pri mori.',
    flag: 'Pruhy sú vodorovné: červená hore, biela v strede, modrá dole.',
  },
  NO: {
    country: 'Nórsko má dlhé pobrežie s fjordmi a siaha ďaleko na sever Európy.',
    flag: 'Červené pole, biely okraj a modrý severský kríž. Všímaj si dvojitý kríž.',
  },
  NZ: {
    country: 'Nový Zéland tvoria hlavne dva veľké ostrovy v Tichom oceáne.',
    flag: 'Je podobná austrálskej, ale má červené hviezdy s bielym okrajom.',
  },
  PL: {
    country: 'Poľsko je náš severný sused a má pobrežie pri Baltskom mori.',
    flag: 'Poľská vlajka má bielu hore a červenú dole. Poradie je najdôležitejšie.',
  },
  RO: {
    country: 'Rumunsko leží pri Čiernom mori a cez jeho územie tečie Dunaj.',
    flag: 'Zvislé pruhy sú modrá, žltá, červená. Je veľmi podobná vlajke Čadu.',
  },
  RS: {
    country: 'Srbsko leží na Balkáne v juhovýchodnej Európe.',
    flag: 'Má červeno-modro-biele pruhy a znak bližšie k žrdi.',
  },
  RU: {
    country: 'Rusko je rozlohou najväčšia krajina sveta a siaha cez Európu aj Áziu.',
    flag: 'Má biely, modrý a červený vodorovný pruh bez znaku.',
  },
  SE: {
    country: 'Švédsko leží v severnej Európe a má množstvo jazier a lesov.',
    flag: 'Žltý severský kríž na modrom poli je výrazný a ľahko zapamätateľný.',
  },
  SI: {
    country: 'Slovinsko má hory, krátke morské pobrežie a leží južne od Rakúska.',
    flag: 'Je podobná slovenskej, ale znak má hory a vlny.',
  },
  SK: {
    country: 'Slovensko leží v srdci Európy a cez Bratislavu tečie Dunaj.',
    flag: 'Na vlajke sú biela, modrá a červená. Znak s dvojkrížom ju odlíši od Ruska či Slovinska.',
  },
  TD: {
    country: 'Čad je vnútrozemská krajina v Afrike, teda nemá prístup k moru.',
    flag: 'Je veľmi podobná rumunskej vlajke. Všímaj si tmavší modrý pruh.',
  },
  UA: {
    country: 'Ukrajina patrí medzi najväčšie krajiny Európy.',
    flag: 'Modrá nad žltou sa často vysvetľuje ako nebo nad obilným poľom.',
  },
  US: {
    country: 'Spojené štáty americké tvoria štáty od Atlantiku až po Tichý oceán.',
    flag: 'Hviezdy predstavujú štáty a pruhy pripomínajú pôvodné kolónie.',
  },
  ZA: {
    country: 'Južná Afrika leží na juhu kontinentu, kde sa stretáva Atlantický a Indický oceán.',
    flag: 'Vlajka má výrazný tvar písmena Y a veľa farieb, preto sa dá spoznať podľa pohybu pruhov.',
  },
};

const getFallbackFacts = (country: Country): FactCopy => ({
  country: `${country.name} má oficiálny názov ${country.officialName} a patrí do oblasti ${country.subregion}. ${regionLens[country.region]}`,
  flag: `Pri vlajke krajiny ${country.name} hľadaj jeden zapamätateľný detail: poradie farieb, smer pruhov, znak, hviezdu alebo kríž.`,
});

export const getCountryFact = (country: Country) => (factsByCode[country.code] || getFallbackFacts(country)).country;

export const getFlagFact = (country: Country) => (factsByCode[country.code] || getFallbackFacts(country)).flag;

export const getKidFact = (country: Country) => {
  return `${getCountryFact(country)} ${getFlagFact(country)}`;
};

export const getCountryStory = (country: Country) => {
  return `${getCountryFact(country)} ${getFlagFact(country)}`;
};
