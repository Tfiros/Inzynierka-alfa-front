# ItemTradeApp

**ItemTradeApp** to aplikacja webowa służąca do wymiany dóbr wirtualnych pomiędzy graczami.
Proces wymiany odbywa się z udziałem pośrednika, którego zadaniem jest nadzorowanie przebiegu transakcji.
Frontend aplikacji umożliwia użytkownikom przeglądanie ofert, tworzenie wymian, składanie kontrofert, komunikację z
pośrednikiem oraz obsługę wybranych funkcji administracyjnych. Celem aplikacji jest stworzenia systemu, gdzie gracze będą mogli w bezpieczny
i kontrolowany sposób dokonywać wymian jednych dóbr wirtualnych na inne, niezaleznie od gry czy platformy z jakiej korzysta dany uzytkownik.

## Technologie

Do stworzenia aplikacji zostały uzyte ponizsze technologie:

- React
- TypeScript
- Vite
- Axios
- Tailwind CSS
- ShadCN UI
- Auth0
- SignalR

## Role użytkowników

W aplikcacji mozemy wyroznić 3 główne typu uzytkowników:

### Zwykły Użytkownik

Ten typ uzytkownika posiada dostęp do większości funkcji systemu. Moze dokonywać wymian, składać kontroferty, komunikować się z opiekunem wymiany za
pomocą chatu jak i równiez przeglądać wszystkie umowy. Jest to najliczniej występujący rodzaj uzytkownika aplikacji. W głównej mierze będą to zapaleni fani gier mający na celu powiększenie swojej kolekcji wirtualnych przedmitów w swojej ulubionej grze.

### Pośrednik

Pośrednik odpowiada za przebieg całej wymiany. Przy jakichkolwiek problemach to on odgrywa rolę sędziego. Jest to uzytkownik zatrudniony przez właściciela platformy. Posiada on dostęp do wszystkich funkcji jakie zapewnia rola zwykłego uzytkownika jak i moze przypisywać siebie do wymiany co sprawia, ze staję sie opiekunem wymiany.

### Administrator

Administrator zarządza danymi całej aplikacji. Moze nie tylko dodawać gry czy przedmioty, ale przedewszystkim zarządza wszystkimi uzytkownikami serwisu.

## Główne funkcje aplikacji

Frontend obsługuje między innymi:

- rejestrację i logowanie użytkownika,
- przeglądanie ofert,
- akceptowanie ofert,
- składanie kontrofert,
- akceptowanie i odrzucanie kontrofert,
- obsługę procesu wymiany,
- czat z pośrednikiem przypisanym do wymiany,
- formularz kontaktowy,
- panel pośrednika,
- zarządzanie użytkownikami,
- zarządzanie grami, gatunkami oraz przedmiotami.

## Architektura frontendu

Cała warstwa frontendowa został zbudowany w oparciu o architekturę modułową. Kod źródłowy znajduje się głównie w katalogu `src`. Z tego folderu mozemy wydorębnić dwa obszary, a mianowicie `features` oraz `shared`. W folderze `features` kazdy moduł odpowiada jednej funkcjonalności aplikacji. Dzięki temu kazda funkcjonalność umieszczona jest w ramach jednego folder co ułatwia rozwój i utrzymanie całej aplikacji. Natomiast katalog `shared` zawiera elementy współdzielone przez różne moduły aplikacji. Dzięki takiemu zabiegowi kod jest podzielony na jasnych zasadach, co nie tylko ułatwia pracę podczas tworzenia projektu, ale równiez pozwala na łatwe rozbudowanie aplikacji o nowe moduły.

## Podział odpowiedzialności

Aplikacja została podzielona na kilka głównych warstw:

- warstwa widoku
- warstwa serwisów
- warstwa typów
- warstwa współdzielona
- warstwa routingu

Dzięki takiemu podziałowi komponenty nie zawierają bezpośredniej logiki komunikacji z Api, zamiast tego wykorzystywane są odpowiednie serwisy do komunikacji.

## Moduły funkcjonalne

Przykładowe moduły aplikacji:

- `chat` - czat
- `contactPage` - formularz kontaktowy,
- `faqsPage` - strona z najczęściej zadawanymi pytaniami,
- `itemManagementPage` - zarządzanie przedmiotami,
- `landingPage` - strona startowa ,
- `marketplacePage` - przeglądanie ofert,
- `notifications` - pwoiadomienia,
- `pointShop` - sklep z tokenami,
- `profilePage` - panel profilu użytkownika,
- `profileEditPage` - panel edycji profilu użytkownika,
- `settingsPage` - ustawienia konta,
- `trades/tradePanelPage` - panel wymian,
- `userManagement` - zarządzanie użytkownikami.

## Część współdzielona

Najważniejsze elementy wykorzystywane w wielu miejscach aplikacji to:

- `api` - konfiguracja komunikacji z backendem,
- `api/services` - serwisy,
- `api/hubs` - obsługa połączeń SignalR,
- `components` - współdzielone komponenty frontendowe,
- `enums` - współdzielone enumy,
- `hooks` - hooki React,
- `store` - współdzielony stan aplikacji,
- `types` - typy TypeScript,
- `utilities` - funkcje pomocnicze,
- `views` - widoki.

## Komunikacja z backendem

Komunikacja z backendem odbywa się przez wydzieloną warstwę API znajdującą się w katalogu `src/shared/api`.

- `ApiClient.tsx` - konfiguracja klienta HTTP,
- `Api.tsx` - funkcje związane z komunikacją z API,
- `ApiResult.tsx` - model odpowiedzi z backendu,
- `services` - serwisy ,
- `hubs` - konfiguracja komunikacji w czasie rzeczywistym.

## Autoryzacja

Aplikacja korzysta z usługi Auth0 do obsługi logowania i autoryzacji użytkowników. Po zalogowaniu uzytkownik otrzymuje token który jest wykorzystywany do wywoływania zabepieczonych końcówek backendowych.

## Routing

Routing odpowiada za przypisanie adresów URL dla odpowiednich widoków w aplikacji. Takie rozwiązanie pozwala w jasny sposób podzielić wszystkie widoki.

## Komunikacja w czasie rzeczywistym

Aplikacja wykorzystuje komunikację w czasie rzeczywistym w obszarach takich jak czat oraz powiadomienia. Do obsługi tego mechanizmu wykorzystywane są połączenia SignalR. Dzięki wykorzystaniu SignalR uzytkownicy są w stanie korzystać z chatu oraz dostawać powiadomienia w czasie rzeczywistym.

## Uruchomienie lokalne

Do uruchomienia projektu lokalnie wymagane jest posiadanie zainstalowanych ponizszych narzędzi:

- Node.js
- npm

Po pobraniu projektu należy zainstalować wszystkie zależności:

```bash
npm install
```

Przed pierwszym lokalnym uruchomieniem naley wygenerować ceryfikat HTTPS:

Najpierw nalezy w zalezności od systemu zainstalować narzędzie mkcert:

```bash
# macOS
brew install mkcert

# Windows
choco install mkcert

# Linux
sudo apt install libnss3-tools
brew install mkcert
```

Następnie nalezy zaufać lokalnemu urzędowi certyfikacyjnemu:

```bash
mkcert -install
```

```bash
mkcert -install
```

W katalogu projektu nalezy wygenerować certyfikat dla lokalnego środowiska:

```bash
mkdir -p certs
mkcert -key-file ./certs/localhost-key.pem -cert-file ./certs/localhost.pem localhost 127.0.0.1 ::1
```

Po przygotowaniu certyfikatów można uruchomić aplikację

```bash
npm run dev
```

## Założenia projektowe

Podczas projektowania warstyw frontendowej przyjęto ponizsze założenia:

- kod został podzielony według funkcjonalności
- logika musi być rozdzielona z warstwą UI
- elementy używane przez wiele modułów aplikacji powinny znajdują się w folderze `shared`
- folder `shared` zawiera współdzielone zasoby aplikacji, takie jak na przykład komponenty, typy lub hooki

Takie podejście pozwala na stosunkowo prosty rozwój aplikacji o nowe funckjonalności oraz zapobiega zbędnej duplikacji kodu.
