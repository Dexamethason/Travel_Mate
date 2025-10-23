# Firebase Authentication Setup

## Konfiguracja Firebase


### 4. Skonfiguruj zmienne środowiskowe
1. Skopiuj plik `env.example` do `.env` w głównym katalogu projektu, albo skopiuj z .env w server i dodaj VITE_ przed firebase zeby front end dzialal 
2. Wypełnij zmienne środowiskowe wartościami z Firebase Console:

```env
VITE_FIREBASE_API_KEY=twoj_api_key
VITE_FIREBASE_AUTH_DOMAIN=twoj_projekt_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=twoj_projekt_id
VITE_FIREBASE_STORAGE_BUCKET=twoj_projekt_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=twoj_sender_id
VITE_FIREBASE_APP_ID=twoj_app_id
VITE_FIREBASE_MEASUREMENT_ID=twoj_measurement_id
```

### 5. Uruchom aplikację
```bash
npm run dev
```

## Funkcjonalności

### ✅ Zaimplementowane funkcje:
- **Logowanie** - logowanie za pomocą email i hasła
- **Rejestracja** - tworzenie nowego konta z weryfikacją email
- **Odzyskiwanie hasła** - resetowanie hasła przez email
- **Weryfikacja email** - automatyczne wysyłanie emaili weryfikacyjnych
- **Zapamiętywanie użytkownika** - opcja "Zapamiętaj mnie"
- **Ochrona tras** - automatyczne przekierowania dla niezalogowanych użytkowników
- **Wylogowanie** - bezpieczne wylogowanie z przekierowaniem

### 🎨 Interfejs użytkownika:
- **Minimalistyczny design** - zgodny ze stylem aplikacji
- **Responsywny** - działa na wszystkich urządzeniach
- **Walidacja formularzy** - walidacja w czasie rzeczywistym
- **Komunikaty błędów** - przyjazne komunikaty w języku polskim
- **Loading states** - wskaźniki ładowania podczas operacji
- **Dark mode support** - obsługa trybu ciemnego

### 🔒 Bezpieczeństwo:
- **Firebase Authentication** - bezpieczne zarządzanie użytkownikami
- **Walidacja po stronie klienta** - walidacja formularzy
- **Ochrona tras** - zabezpieczenie przed nieautoryzowanym dostępem
- **Sesje** - zarządzanie sesjami użytkowników

## Struktura plików

```
src/
├── config/
│   └── firebase.ts          # Konfiguracja Firebase
├── composables/
│   └── useAuth.ts           # Composable do zarządzania autentykacją
├── layouts/
│   ├── AuthLayout.vue       # Layout dla stron logowania/rejestracji
│   └── MainLayout.vue       # Główny layout z nawigacją
├── views/
│   ├── LoginView.vue        # Strona logowania
│   ├── RegisterView.vue     # Strona rejestracji
│   └── ForgotPasswordView.vue # Strona odzyskiwania hasła
└── router/
    └── index.ts             # Konfiguracja routingu z guardami
```

## Użycie

### Logowanie
```typescript
const { signIn, user, loading, error } = useAuth()

const handleLogin = async () => {
  const result = await signIn(email, password, rememberMe)
  if (result.success) {
    // Przekierowanie do dashboard
  }
}
```

### Rejestracja
```typescript
const { register, user, loading, error } = useAuth()

const handleRegister = async () => {
  const result = await register(email, password)
  if (result.success) {
    // Email weryfikacyjny został wysłany
  }
}
```

### Wylogowanie
```typescript
const { logout } = useAuth()

const handleLogout = async () => {
  await logout()
}
```

## Rozwiązywanie problemów

### Błąd: "Firebase configuration is missing"
- Sprawdź czy plik `.env` istnieje i zawiera wszystkie wymagane zmienne
- Upewnij się, że zmienne zaczynają się od `VITE_`

### Błąd: "Invalid email format"
- Sprawdź czy email jest w poprawnym formacie
- Upewnij się, że pole email nie jest puste

### Błąd: "User not found"
- Sprawdź czy użytkownik został zarejestrowany
- Sprawdź czy email jest poprawny

### Błąd: "Email already in use"
- Użytkownik z tym emailem już istnieje
- Użyj opcji "Nie pamiętasz hasła?" aby zresetować hasło
