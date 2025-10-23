# 🌍 Travel Mate

Aplikacja do planowania podróży, która łączy wyszukiwanie lotów, zarządzanie budżetem i planowanie wycieczek w jednym miejscu.

## 📋 Opis projektu

Travel Mate to nowoczesna aplikacja webowa stworzona w Vue 3 z TypeScript, która pomaga w kompleksowym planowaniu podróży. Aplikacja integruje różne aspekty planowania - od wyszukiwania lotów, przez zarządzanie budżetem, po planowanie harmonogramu podróży.

### Główne funkcjonalności

- **🏠 Dashboard** - Przegląd wszystkich zaplanowanych podróży
- **✈️ Wyszukiwanie lotów** - Zaawansowane wyszukiwanie z filtrami
- **💰 Zarządzanie budżetem** - Śledzenie wydatków i kontrola kosztów
- **🏨 Noclegi** - Wyszukiwanie i rezerwacja miejsc noclegowych (w przygotowaniu)
- **📅 Plan podróży** - Interaktywny kalendarz z planem dzień po dniu (w przygotowaniu)
- **🎭 Atrakcje** - Odkrywanie lokalnych atrakcji i restauracji (w przygotowaniu)

## 🚀 Jak uruchomić projekt

### Wymagania

- Node.js (v18 lub nowszy)
- npm lub yarn

### Instalacja

1. Sklonuj repozytorium lub przejdź do katalogu projektu:

```bash
cd Travel_Mate
```

2. Zainstaluj zależności:

```bash
npm install
```

### Uruchomienie w trybie deweloperskim

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: `http://localhost:5173`

### Build produkcyjny

```bash
npm run build
```

### Podgląd buildu produkcyjnego

```bash
npm run preview
```

## 🛠️ Technologie

- **Framework**: Vue 3 (Composition API)
- **Język**: TypeScript
- **Routing**: Vue Router 4
- **Stylizacja**: Tailwind CSS v4
- **Build tool**: Vite
- **Backend**: Firebase (planowane)

## 📁 Struktura projektu

```
src/
├── assets/          # Zasoby statyczne (obrazy, ikony)
├── components/      # Komponenty wielokrotnego użytku
├── composables/     # Funkcje kompozycyjne Vue
├── firebase/        # Konfiguracja Firebase
├── layouts/         # Layouty aplikacji
│   └── MainLayout.vue
├── router/          # Konfiguracja routingu
│   └── index.ts
├── utils/           # Funkcje pomocnicze
├── views/           # Widoki/strony aplikacji
│   ├── DashboardView.vue
│   ├── FlightsView.vue
│   ├── BudgetView.vue
│   ├── AccommodationsView.vue
│   ├── ItineraryView.vue
│   ├── ActivitiesView.vue
│   └── ProfileView.vue
├── App.vue          # Główny komponent aplikacji
├── main.ts          # Punkt wejścia aplikacji
└── style.css        # Globalne style
```

## 🎨 Wygląd aplikacji

Aplikacja wykorzystuje nowoczesny design oparty na Tailwind CSS z:

- Responsywnym layoutem
- Trybem ciemnym (dark mode)
- Kolorem głównym: `#13a4ec` (niebieski)
- Czcionką: Plus Jakarta Sans

## 👥 Autorzy

- Jakub Rogula
- Daniel Koćma
- Bartłomiej Prześlak

## 📝 Licencja

Projekt prywatny - wszelkie prawa zastrzeżone.

## 🔜 Planowane funkcjonalności

- [ ] Integracja z API Skyscanner/Amadeus dla lotów
- [ ] Integracja z Booking.com/Airbnb API dla noclegów
- [ ] Integracja z Google Places/Yelp dla atrakcji
- [ ] System autentykacji użytkowników (Firebase Auth)
- [ ] Współdzielenie planów podróży z innymi użytkownikami
- [ ] Eksport planu podróży do PDF
- [ ] Powiadomienia o zmianach cen lotów
- [ ] Wizualizacja budżetu za pomocą wykresów (Chart.js)
- [ ] Wielojęzyczność (i18n)

## 🐛 Zgłaszanie błędów

W razie znalezienia błędów lub problemów, proszę utworzyć issue w repozytorium.
