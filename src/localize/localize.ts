import * as en from './languages/en.json';
import * as de from './languages/de.json';
import * as es from './languages/es.json';
import * as nb from './languages/nb.json';
import * as ru from './languages/ru.json';


const languages: any = {
  en: en,
  de: de,
  es: es,
  nb: nb,
  ru: ru,
};

export function localize(string: string, search = '', replace = ''): string {
  const lang = (localStorage.getItem('selectedLanguage') || 'en').replace(/['"]+/g, '').replace('-', '_');

  let translated: string;

  try {
    translated = string.split('.').reduce((o, i) => o[i], languages[lang]);
  } catch (e) {
    translated = string.split('.').reduce((o, i) => o[i], languages['en']);
  }

  if (translated === undefined) translated = string.split('.').reduce((o, i) => o[i], languages['en']);

  if (search !== '' && replace !== '') {
    translated = translated.replace(search, replace);
  }
  return translated;
}
