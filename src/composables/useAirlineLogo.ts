import { ref, computed } from 'vue';

const logoCache = new Map<string, string | null>();

// Mapowanie kodów IATA na nazwy plików logo
const LOGO_FILE_NAMES: Record<string, string> = {
  A3: 'Aegean-Airlines-Logo-SVG_006',
  EI: 'Aer-Lingus-Logo-SVG_001',
  AF: 'Air-France-logo-2',
  OS: 'Austrian-Airlines-Logo-SVG_002',
  BA: 'British-Airways-Logo-2',
  DL: 'Delta-Air-Lines-logo',
  U2: 'EasyJet-Logo-SVG_001',
  EK: 'Emirates-Logo-3',
  IB: 'Iberia-Logo-SVG_001',
  KL: 'KLM-Logo-4',
  LO: 'LOT-Polish-Airlines-Logo-PNG1',
  LH: 'Lufthansa-Logo-1',
  QR: 'Qatar-Airways-Logo-1',
  FR: 'Ryanair-Logo-SVG_001',
  SK: 'SAS-Logo-SVG_002',
  LX: 'Swiss-International-Air-Lines-Logo-SVG_001',
  TK: 'Turkish-Airlines-Logo-1',
  UA: 'United-Airlines-Logo-2',
  VS: 'Virgin-Atlantic-Logo-4',
};

export function useAirlineLogo(airlineCode: string) {
  const hasError = ref(false);

  const logoUrl = computed(() => {
    if (hasError.value) return null;
    if (!airlineCode) return null;

    // Sprawdź cache
    if (logoCache.has(airlineCode)) {
      return logoCache.get(airlineCode);
    }

    const fileName = LOGO_FILE_NAMES[airlineCode];

    if (fileName) {
      const url = `/AirlineLogos/${fileName}.svg`;
      logoCache.set(airlineCode, url);
      return url;
    }

    logoCache.set(airlineCode, null);
    return null;
  });

  const handleError = () => {
    hasError.value = true;
    logoCache.set(airlineCode, null);
  };

  return {
    logoUrl,
    handleError,
    hasError,
  };
}
