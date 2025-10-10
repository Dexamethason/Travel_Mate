# 🌍 Project Context — Aplikacja do Planowania Podróży

**Autorzy:** Jakub Rogula, Daniel Koćma, Bartłomiej Prześlak  
**Cel:** Stworzenie interaktywnej aplikacji webowej do planowania podróży, integrującej loty, noclegi, atrakcje i budżet w jednym miejscu.  
**Technologia:** Vue 3 + Composition API  
**Zakres projektu:** frontend z integracjami API (brak własnego backendu)

---

## 🧭 1. Opis projektu

Aplikacja pozwala użytkownikom planować podróże indywidualne i grupowe. Integruje dane z zewnętrznych źródeł (API przewoźników, hoteli, atrakcji), umożliwia tworzenie planu podróży w kalendarzu, monitorowanie budżetu oraz dodawanie noclegów, lotów i atrakcji do harmonogramu.

Celem projektu jest stworzenie kompletnego narzędzia podróżniczego z intuicyjnym UI i realnym zastosowaniem.

---

## ⚙️ 2. Technologie i architektura

**Frontend:**  
- Framework: Vue 3 (Composition API)  
- Routing: Vue Router  
- Stylizacja: Tailwind CSS  
- Mapy: Google Maps
- i18n: vue-i18n  
- Powiadomienia: Toast lub HeadlessUI  
- Wykresy i budżet: Chart.js  
- Export do PDF: jsPDF   

**Architektura:**  
- Komponentowa struktura Vue (`/components`, `/views`, `/composables`, `/assets`)  
- Modularny podział funkcjonalny: `flights`, `hotels`, `attractions`, `planner`, `budget`, `profile`  
- Integracja przez adaptery API (`/api/adapters`)  
---

## 🧩 3. Wymagania funkcjonalne

### 3.1. Rejestracja i logowanie
- Rejestracja przez e-mail + hasło lub Google (opcjonalnie)  
- Logowanie / wylogowanie  
- Resetowanie hasła  
- Edycja profilu użytkownika  

### 3.2. Wyszukiwanie lotów ✈️
- Integracja z API: Skyscanner, Amadeus  
- Wyszukiwanie: w jedną stronę / w obie strony / wieloodcinkowe  
- Filtry: cena, czas lotu, liczba przesiadek, przewoźnik  
- Sortowanie wyników  
- Subskrypcja powiadomień o spadku ceny  

### 3.3. Rezerwacja noclegów 🏨
- Integracja z Booking.com / Airbnb API  
- Filtrowanie: cena, typ obiektu, ocena, lokalizacja  
- Szczegóły oferty  
- Dodanie do planu podróży  

### 3.4. Atrakcje i restauracje 🍽️
- Integracja z Google Places / Yelp API  
- Kategoryzacja (muzea, plaże, restauracje, parki)  
- Filtrowanie wg ocen, popularności, odległości  
- Dodanie do planu  
- Wizualizacja na mapie  

### 3.5. Interaktywny planer (not now) 🗓️
- Widok kalendarza  
- Drag & Drop do tworzenia harmonogramu  
- Automatyczne generowanie planu podróży  
- Edycja i komentarze  
- Eksport do PDF  

### 3.6. Budżet podróży (not now) 💰
- Szacowanie kosztów  
- Dodawanie wydatków do kategorii  
- Wykresy kosztów i statystyki  
- Zestawienie końcowe  

---


## 🧭 5. Struktura katalogów projektu (Vue 3)

src/
├── api/
│ ├── adapters/
│ └── types/
├── assets/
├── components/
├── composables/
├── layouts/
├── router/
├── store/ # jeśli Pinia zostanie przywrócona
├── views/
│ ├── Flights/
│ ├── Hotels/
│ ├── Attractions/
│ ├── Planner/
│ ├── Budget/
│ ├── Group/
│ └── Profile/
├── utils/
├── App.vue
└── main.ts

## 📱 6. Widoki aplikacji (UI Views)

| Widok | Opis | Główne elementy |
|--------|------|----------------|
| **HomeView** | Strona główna z wyszukiwarką podróży | hero, CTA, skróty do lotów, noclegów |
| **FlightsView** | Wyszukiwanie i filtrowanie lotów | formularz, lista wyników, sortowanie, zapis do planu |
| **HotelsView** | Wyszukiwanie noclegów | mapa, lista obiektów, szczegóły, przycisk „Dodaj do planu” |
| **AttractionsView** | Atrakcje i restauracje | mapa, kategorie, filtrowanie |
| **PlannerView** | Harmonogram podróży | kalendarz, drag & drop, edycja elementów |
| **BudgetView** | Budżet podróży | formularz wydatków, wykresy, sumy |
| **ProfileView** | Profil użytkownika | dane osobowe, hasło, język, motyw |


---

## 📱 6. Widoki aplikacji (UI Views)

| Widok | Opis | Główne elementy |
|--------|------|----------------|
| **HomeView** | Strona główna z wyszukiwarką podróży | hero, CTA, skróty do lotów, noclegów |
| **FlightsView** | Wyszukiwanie i filtrowanie lotów | formularz, lista wyników, sortowanie, zapis do planu |
| **HotelsView** | Wyszukiwanie noclegów | mapa, lista obiektów, szczegóły, przycisk „Dodaj do planu” |
| **AttractionsView** | Atrakcje i restauracje | mapa, kategorie, filtrowanie |
| **PlannerView** | Harmonogram podróży | kalendarz, drag & drop, edycja elementów |
| **BudgetView** | Budżet podróży | formularz wydatków, wykresy, sumy |
| **GroupView** | Planowanie grupowe | czat / komentarze, współdzielony plan |
| **ProfileView** | Profil użytkownika | dane osobowe, hasło, język, motyw |
| **DocsView** | Dokumenty podróżne | lista plików, podgląd, data ważności |

---

## 🔗 7. Integracje z API

| Obszar | API | Opis |
|--------|-----|------|
| Loty | Skyscanner / Amadeus | wyszukiwanie i filtrowanie lotów |
| Noclegi | Booking.com / Airbnb | pobieranie ofert, szczegóły, lokalizacje |
| Atrakcje | Google Places / Yelp | popularne miejsca i restauracje |

---

## 🎨 8. Standardy UI/UX

- Minimalistyczny styl podróżniczy
- Duże, czytelne karty ofert  
- Ikony (np. Lucide lub Heroicons)  
- Animacje (Framer Motion lub Transition API Vue)  
- Tryb ciemny / jasny  
- Layout siatkowy

---

## 🧪 9. Testowanie i CI/CD

- Testy jednostkowe (Vitest)  
- Testy e2e (Cypress – opcjonalnie)  
- GitHub Actions do automatycznego builda i testów  
- Deployment: Netlify / Vercel  

---