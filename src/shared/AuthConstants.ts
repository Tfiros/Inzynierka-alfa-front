import type { AuthModalView } from './ModalTypes'

export const authTitles: Record<AuthModalView, string> = {
  login: 'Zaloguj się do CrossTrade',
  register: 'Zarejestruj się do CrossTrade',
  'forgot-email': 'Przypomnij hasło',
  'forgot-code': 'Wprowadź kod',
  'forgot-reset': 'Ustaw nowe hasło',
  'forgot-success': 'Wysłano email z instrukcjami',
}

export const authDescriptions: Record<AuthModalView, string> = {
  login: 'Zaloguj się, aby zacząć korzystać z wszystkich funkcji CrossTrade',
  register:
    'Utwórz konto, aby zacząć korzystać z wszystkich funkcji CrossTrade',
  'forgot-email': 'Wprowadź swój email, aby otrzymać kod do zresetowania hasła',
  'forgot-code': 'Wprowadź kod, który został wysłany na Twój email',
  'forgot-reset': 'Ustaw nowe hasło do swojego konta',
  'forgot-success': 'Email został wysłany z instrukcjami resetu hasła',
}
