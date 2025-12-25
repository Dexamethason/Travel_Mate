<template>
  <AttractionsList 
    :attractions="sortedAttractions"
    :filters="filters"
    :sort-by="sortBy"
    :active-filters-count="activeFiltersCount"
    @update:filters="updateFilters"
    @update:sort-by="updateSortBy"
    @reset-filters="resetFilters"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AttractionsList from './AttractionsList.vue';
import { useAttractionFilters } from '@/composables/useAttractionFilters';
import type { Attraction } from '@/types/activitie';

// Przykładowe dane atrakcji z rozszerzonymi informacjami
const attractions = ref<Attraction[]>([
  {
    id: 1,
    photo: '',
    name: 'Wieża Eiffla',
    rating: 4.6,
    reviews: 125000,
    category: 'Zabytek',
    type: 'Zabytek',
    price: '€€',
    priceRange: '€€',
    distance: '5 min spacerem',
    duration: '2-3 godziny',
    wheelchairAccessible: true,
    openingHours: 'Czynne do 23:45',
    status: 'Otwarte',
    buttonText: 'Kup bilet',
    description: 'Kultowa stalowa wieża z 1889 roku, symbol Paryża i Francji. Wznosi się na wysokość 330 metrów i oferuje spektakularne widoki na całe miasto. Dostępne są trzy poziomy dla zwiedzających, z restauracjami i sklepami z pamiątkami. Wieczorem wieża jest pięknie oświetlona, a co godzinę przez 5 minut błyszczy tysiącami świateł.',
    address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paryż',
    phone: '+33 892 70 12 39',
    website: 'https://www.toureiffel.paris',
    amenities: ['Winda', 'Restauracja', 'Sklep', 'Toalety', 'Audio przewodnik'],
    photos: [
      'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800',
      'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800',
    ],
    detailedReviews: [
      {
        id: 1,
        author: 'Karolina Nowak',
        rating: 5.0,
        date: '2024-01-20',
        comment: 'Absolutnie must-see w Paryżu! Widoki są niesamowite, szczególnie o zmierzchu. Polecam kupić bilety online z wyprzedzeniem, żeby uniknąć kolejek.',
        helpful: 142,
      },
      {
        id: 2,
        author: 'James Anderson',
        rating: 4.5,
        date: '2024-01-18',
        comment: 'Niesamowite przeżycie! Bardzo zatłoczone, ale warto. Bilety na szczyt są droższe, ale widoki są tego warte.',
        helpful: 98,
      },
      {
        id: 3,
        author: 'Marie Dupont',
        rating: 4.0,
        date: '2024-01-15',
        comment: 'Piękne miejsce, ale bardzo dużo turystów. Najlepiej przyjść wcześnie rano lub późnym wieczorem.',
        helpful: 76,
      },
      {
        id: 4,
        author: 'Hans Schmidt',
        rating: 5.0,
        date: '2024-01-12',
        comment: 'Spektakularne! Kolacja w restauracji Jules Verne była czymś wyjątkowym. Widok na oświetlony Paryż z góry to niezapomniane przeżycie.',
        helpful: 124,
      },
      {
        id: 5,
        author: 'Sofia Martinez',
        rating: 4.5,
        date: '2024-01-08',
        comment: 'Magiczne miejsce, zwłaszcza nocą gdy wieża się świeci. Schody na drugie piętro to dobra alternatywa dla windy.',
        helpful: 89,
      },
    ],
  },
  {
    id: 2,
    photo: '',
    name: 'Luwr',
    rating: 4.8,
    reviews: 98000,
    category: 'Muzeum',
    type: 'Muzeum',
    price: '€€',
    priceRange: '€€',
    distance: '15 min spacerem',
    duration: '3-4 godziny',
    wheelchairAccessible: true,
    openingHours: 'Czynne do 18:00',
    status: 'Otwarte',
    buttonText: 'Kup bilet',
    description: 'Największe muzeum sztuki na świecie, mieszczące się w dawnym pałacu królewskim. Kolekcja obejmuje ponad 35 000 dzieł sztuki, w tym Mona Lisę Leonarda da Vinci, Wenus z Milo i Zwycięstwo Samotraki. Oszklona piramida przy wejściu jest dziełem I.M. Pei z 1989 roku.',
    address: 'Rue de Rivoli, 75001 Paryż',
    phone: '+33 1 40 20 53 17',
    website: 'https://www.louvre.fr',
    amenities: ['Audio przewodnik', 'Kawiarnia', 'Restauracja', 'Sklep', 'Toalety', 'Szatnia'],
    photos: [
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800',
    ],
    detailedReviews: [
      {
        id: 1,
        author: 'Anna Wiśniewska',
        rating: 5.0,
        date: '2024-01-19',
        comment: 'Niesamowita kolekcja sztuki! Potrzeba kilku dni, żeby zobaczyć wszystko. Mona Lisa jest mniejsza niż się spodziewałam, ale wciąż imponująca.',
        helpful: 156,
      },
      {
        id: 2,
        author: 'Robert Taylor',
        rating: 4.5,
        date: '2024-01-16',
        comment: 'Muzeum jest ogromne i łatwo się zgubić. Polecam pobrać aplikację lub wziąć przewodnika. Egipska kolekcja jest fascynująca!',
        helpful: 103,
      },
      {
        id: 3,
        author: 'Elena Petrova',
        rating: 5.0,
        date: '2024-01-14',
        comment: 'Absolutnie wspaniałe miejsce! Kup bilety online z wyprzedzeniem. Środa i piątek są otwarte do późna.',
        helpful: 87,
      },
      {
        id: 4,
        author: 'Miguel Santos',
        rating: 4.0,
        date: '2024-01-10',
        comment: 'Niesamowite dzieła sztuki, ale bardzo zatłoczone przy Mona Lisie. Warto poświęcić czas na mniej popularne sale.',
        helpful: 72,
      },
    ],
  },
  {
    id: 3,
    photo: '',
    name: 'Katedra Notre-Dame',
    rating: 4.7,
    reviews: 87000,
    category: 'Zabytek',
    type: 'Zabytek',
    price: 'Darmowe',
    priceRange: 'Darmowe',
    distance: '10 min spacerem',
    duration: '1-2 godziny',
    wheelchairAccessible: false,
    openingHours: 'W trakcie renowacji',
    status: 'Zamknięte',
    buttonText: 'Niedostępne',
    description: 'Gotycka katedra z XII wieku, arcydzieło architektury średniowiecznej. Słynna z imponujących witraży, rzeźb i dzwonów. Obecnie w trakcie odbudowy po pożarze z 2019 roku. Plac przed katedrą jest nadal dostępny dla zwiedzających.',
    address: '6 Parvis Notre-Dame, 75004 Paryż',
    website: 'https://www.notredamedeparis.fr',
    amenities: ['Przewodnicy'],
    detailedReviews: [
      {
        id: 1,
        author: 'Thomas Müller',
        rating: 5.0,
        date: '2024-01-17',
        comment: 'Mimo że jest zamknięta, warto zobaczyć z zewnątrz. Prace renowacyjne są imponujące. Mam nadzieję, że wkrótce zostanie otwarta.',
        helpful: 94,
      },
      {
        id: 2,
        author: 'Claire Blanc',
        rating: 4.5,
        date: '2024-01-11',
        comment: 'Piękna architektura nawet z zewnątrz. Okolica jest bardzo malownicza z mnóstwem kawiarni.',
        helpful: 68,
      },
    ],
  },
  {
    id: 4,
    photo: '',
    name: 'Arc de Triomphe',
    rating: 4.5,
    reviews: 72000,
    category: 'Zabytek',
    type: 'Zabytek',
    price: '€',
    priceRange: '€',
    distance: '8 min spacerem',
    duration: '1 godzina',
    wheelchairAccessible: true,
    openingHours: 'Czynne do 22:30',
    status: 'Otwarte',
    buttonText: 'Kup bilet',
    description: 'Monumentalny łuk triumfalny zlecony przez Napoleona Bonaparte w 1806 roku. Znajduje się na placu Charles de Gaulle w centrum 12 alei, w tym słynnych Pól Elizejskich. Pod łukiem znajduje się Grób Nieznanego Żołnierza z wiecznym płomieniem.',
    address: 'Place Charles de Gaulle, 75008 Paryż',
    phone: '+33 1 55 37 73 77',
    website: 'https://www.paris-arc-de-triomphe.fr',
    amenities: ['Taras widokowy', 'Muzeum', 'Sklep', 'Toalety'],
    photos: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    ],
    detailedReviews: [
      {
        id: 1,
        author: 'Julia Kowalczyk',
        rating: 5.0,
        date: '2024-01-21',
        comment: 'Wspaniały widok z góry na Pola Elizejskie i całe miasto! Warto wejść na taras, chociaż trzeba pokonać sporo schodów.',
        helpful: 118,
      },
      {
        id: 2,
        author: 'David Brown',
        rating: 4.0,
        date: '2024-01-13',
        comment: 'Imponujący zabytek, szczególnie o zmierzchu. Ceremonia zapłonu wiecznego płomienia jest wzruszająca.',
        helpful: 85,
      },
      {
        id: 3,
        author: 'Francesca Rossi',
        rating: 4.5,
        date: '2024-01-09',
        comment: 'Piękne miejsce z bogatą historią. Muzeum w środku jest małe, ale interesujące.',
        helpful: 71,
      },
    ],
  },
  {
    id: 5,
    photo: '',
    name: 'Sacré-Cœur',
    rating: 4.6,
    reviews: 95000,
    category: 'Zabytek',
    type: 'Zabytek',
    price: 'Darmowe',
    priceRange: 'Darmowe',
    distance: '20 min taksówką',
    duration: '1-2 godziny',
    wheelchairAccessible: false,
    openingHours: 'Czynne do 22:15',
    status: 'Otwarte',
    buttonText: 'Zwiedzaj',
    description: 'Rzymskokatolicka bazylika na szczycie wzgórza Montmartre, najwyższego punktu Paryża. Zbudowana w latach 1875-1914 w stylu romańsko-bizantyjskim. Biały kamień travertynowy sprawia, że bazylika świeci się w słońcu. Wspaniały widok na całe miasto z tarasu i okolicy.',
    address: '35 Rue du Chevalier de la Barre, 75018 Paryż',
    phone: '+33 1 53 41 89 00',
    website: 'https://www.sacre-coeur-montmartre.com',
    amenities: ['Kaplica', 'Dzwonnica', 'Sklep', 'Krypta'],
    photos: [
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800',
    ],
    detailedReviews: [
      {
        id: 1,
        author: 'Piotr Nowicki',
        rating: 5.0,
        date: '2024-01-22',
        comment: 'Absolutnie magiczne miejsce! Widoki z tarasu są niesamowite. Warto wejść do środka, wnętrze jest przepiękne.',
        helpful: 167,
      },
      {
        id: 2,
        author: 'Sarah Johnson',
        rating: 4.5,
        date: '2024-01-17',
        comment: 'Piękna bazylika z niesamowitym widokiem. Dzielnica Montmartre wokół jest pełna artystów i uroku.',
        helpful: 129,
      },
      {
        id: 3,
        author: 'Andreas Weber',
        rating: 4.0,
        date: '2024-01-14',
        comment: 'Warto wejść na szczyt dzwonnicy za dodatkową opłatą. Schody są męczące, ale widok jest tego wart!',
        helpful: 96,
      },
      {
        id: 4,
        author: 'Lucia Fernandez',
        rating: 5.0,
        date: '2024-01-11',
        comment: 'Najpiękniejsza bazylika jaką widziałam! O zachodzie słońca jest szczególnie romantycznie.',
        helpful: 143,
      },
    ],
  },
]);

const { 
  filters, 
  sortBy, 
  sortedAttractions, 
  resetFilters, 
  activeFiltersCount 
} = useAttractionFilters(attractions);

const updateFilters = (newFilters: any) => {
  filters.value = { ...filters.value, ...newFilters };
};

const updateSortBy = (newSort: any) => {
  sortBy.value = newSort;
};
</script>
