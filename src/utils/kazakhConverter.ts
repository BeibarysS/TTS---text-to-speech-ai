/**
 * Kazakh orthography utilities:
 * 1. Cyrillic <-> New State Latin (Jańa qazaq latyn álipbıi) converter
 * 2. Numbers to Kazakh words expander (Сандарды қазақша жазбаша сөзге айналдыру)
 */

const CYR_TO_LAT_MAP: Record<string, string> = {
  'А': 'A', 'а': 'a',
  'Ә': 'Á', 'ә': 'á',
  'Б': 'B', 'б': 'b',
  'В': 'V', 'в': 'v',
  'Г': 'G', 'г': 'g',
  'Ғ': 'Ǵ', 'ғ': 'ǵ',
  'Д': 'D', 'д': 'd',
  'Е': 'E', 'е': 'e',
  'Ё': 'Io', 'ё': 'io',
  'Ж': 'J', 'ж': 'j',
  'З': 'Z', 'з': 'z',
  'И': 'I', 'и': 'i',
  'Й': 'I', 'й': 'i',
  'К': 'K', 'к': 'k',
  'Қ': 'Q', 'қ': 'q',
  'Л': 'L', 'л': 'l',
  'М': 'M', 'м': 'm',
  'Н': 'N', 'н': 'n',
  'Ң': 'Ń', 'ң': 'ń',
  'О': 'O', 'о': 'o',
  'Ө': 'Ó', 'ө': 'ó',
  'П': 'P', 'п': 'p',
  'Р': 'R', 'р': 'r',
  'С': 'S', 'с': 's',
  'Т': 'T', 'т': 't',
  'У': 'Ý', 'у': 'ý',
  'Ұ': 'U', 'ұ': 'u',
  'Ү': 'Ú', 'ү': 'ú',
  'Ф': 'F', 'ф': 'f',
  'Х': 'H', 'х': 'h',
  'Һ': 'H', 'һ': 'h',
  'Ц': 'Ts', 'ц': 'ts',
  'Ч': 'Ch', 'ч': 'ch',
  'Ш': 'Sh', 'ш': 'sh',
  'Щ': 'Shch', 'щ': 'shch',
  'Ъ': '', 'ъ': '',
  'Ы': 'Y', 'ы': 'y',
  'І': 'I', 'і': 'i',
  'Ь': '', 'ь': '',
  'Э': 'E', 'э': 'e',
  'Ю': 'Iý', 'ю': 'iý',
  'Я': 'Ia', 'я': 'ia',
};

const LAT_TO_CYR_PAIRS: [string, string][] = [
  ['Shch', 'Щ'], ['shch', 'щ'],
  ['Sh', 'Ш'], ['sh', 'ш'],
  ['Ch', 'Ч'], ['ch', 'ч'],
  ['Ts', 'Ц'], ['ts', 'ц'],
  ['Iý', 'Ю'], ['iý', 'ю'],
  ['Ia', 'Я'], ['ia', 'я'],
  ['Io', 'Ё'], ['io', 'ё'],
  ['Á', 'Ә'], ['á', 'ә'],
  ['Ǵ', 'Ғ'], ['ǵ', 'ғ'],
  ['Ń', 'Ң'], ['ń', 'ң'],
  ['Ó', 'Ө'], ['ó', 'ө'],
  ['Q', 'Қ'], ['q', 'қ'],
  ['Ý', 'У'], ['ý', 'у'],
  ['Ú', 'Ү'], ['ú', 'ү'],
  ['A', 'А'], ['a', 'а'],
  ['B', 'Б'], ['b', 'б'],
  ['V', 'В'], ['v', 'в'],
  ['G', 'Г'], ['g', 'г'],
  ['D', 'Д'], ['d', 'д'],
  ['E', 'Е'], ['e', 'е'],
  ['J', 'Ж'], ['j', 'ж'],
  ['Z', 'З'], ['z', 'з'],
  ['I', 'І'], ['i', 'і'],
  ['K', 'К'], ['k', 'к'],
  ['L', 'Л'], ['l', 'л'],
  ['M', 'М'], ['m', 'м'],
  ['N', 'Н'], ['n', 'н'],
  ['O', 'О'], ['o', 'о'],
  ['P', 'П'], ['p', 'п'],
  ['R', 'Р'], ['r', 'р'],
  ['S', 'С'], ['s', 'с'],
  ['T', 'Т'], ['t', 'т'],
  ['U', 'Ұ'], ['u', 'ұ'],
  ['F', 'Ф'], ['f', 'ф'],
  ['H', 'Х'], ['h', 'х'],
  ['Y', 'Ы'], ['y', 'ы'],
];

export function cyrillicToLatin(text: string): string {
  return text.split('').map(char => CYR_TO_LAT_MAP[char] ?? char).join('');
}

export function latinToCyrillic(text: string): string {
  let result = text;
  for (const [lat, cyr] of LAT_TO_CYR_PAIRS) {
    result = result.replaceAll(lat, cyr);
  }
  return result;
}

const ONES = ['', 'бір', 'екі', 'үш', 'төрт', 'бес', 'алты', 'жеті', 'сегіз', 'тоғыз'];
const TENS = ['', 'он', 'жиырма', 'отыз', 'қырық', 'елу', 'алпыс', 'жетпіс', 'сексен', 'тоқсан'];

function convertUnderThousand(num: number): string {
  const parts: string[] = [];
  const hundreds = Math.floor(num / 100);
  const remainder = num % 100;
  const tens = Math.floor(remainder / 10);
  const ones = remainder % 10;

  if (hundreds > 0) {
    if (hundreds === 1) {
      parts.push('жүз');
    } else {
      parts.push(`${ONES[hundreds]} жүз`);
    }
  }

  if (tens > 0) {
    parts.push(TENS[tens]);
  }

  if (ones > 0) {
    parts.push(ONES[ones]);
  }

  return parts.join(' ');
}

export function numberToKazakhWords(num: number): string {
  if (num === 0) return 'нөл';
  if (num < 0) return `минус ${numberToKazakhWords(Math.abs(num))}`;

  const billions = Math.floor(num / 1_000_000_000);
  const millions = Math.floor((num % 1_000_000_000) / 1_000_000);
  const thousands = Math.floor((num % 1_000_000) / 1000);
  const remainder = num % 1000;

  const chunks: string[] = [];

  if (billions > 0) {
    chunks.push(`${convertUnderThousand(billions)} миллиард`);
  }
  if (millions > 0) {
    chunks.push(`${convertUnderThousand(millions)} миллион`);
  }
  if (thousands > 0) {
    if (thousands === 1) {
      chunks.push('мың');
    } else {
      chunks.push(`${convertUnderThousand(thousands)} мың`);
    }
  }
  if (remainder > 0) {
    chunks.push(convertUnderThousand(remainder));
  }

  return chunks.join(' ').trim();
}

/**
 * Replaces digits in text with Kazakh spoken words
 * e.g. "2026 жылы 15 наурыз" -> "екі мың жиырма алты жылы он бес наурыз"
 */
export function expandNumbersInText(text: string): string {
  return text.replace(/\b\d+\b/g, match => {
    const parsed = parseInt(match, 10);
    if (!isNaN(parsed) && parsed <= 999_999_999_999) {
      return numberToKazakhWords(parsed);
    }
    return match;
  });
}
