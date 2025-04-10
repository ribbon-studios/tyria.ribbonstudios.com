export function formatter(value: string | number | boolean) {
  return new Formatter(value.toString());
}

class Formatter {
  #value: string;

  constructor(value: string) {
    this.#value = value;
  }

  get sanitize(): this {
    this.#value = this.#value
      .split('')
      .map((c) => sanitize.special_characters[c] ?? c)
      .join('');

    return this;
  }

  get lower(): this {
    this.#value = this.#value.toLowerCase();

    return this;
  }

  get upper(): this {
    this.#value = this.#value.toUpperCase();

    return this;
  }

  value(): string {
    return this.#value;
  }
}
export namespace sanitize {
  export const special_characters: Record<string, string> = {
    š: 's',
    ž: 'z',
    þ: 'y',
    à: 'a',
    á: 'a',
    â: 'a',
    ã: 'a',
    ä: 'a',
    å: 'a',
    ç: 'c',
    è: 'e',
    é: 'e',
    ê: 'e',
    ë: 'e',
    ì: 'i',
    í: 'i',
    î: 'i',
    ï: 'i',
    ð: 'd',
    ñ: 'n',
    ò: 'o',
    ó: 'o',
    ô: 'o',
    õ: 'o',
    ö: 'o',
    ù: 'u',
    ú: 'u',
    û: 'u',
    ü: 'u',
    ý: 'y',
  };
}
