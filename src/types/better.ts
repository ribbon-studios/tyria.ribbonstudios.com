export namespace Better {
  export type Partial<T, K extends keyof T> = Omit<T, K> & globalThis.Partial<Pick<T, K>>;
  export type Required<T, K extends keyof T> = globalThis.Required<Pick<T, K>> & Omit<T, K>;

  export namespace Partial {
    export type Inverse<T, K extends keyof T> = Partial<T, Exclude<keyof T, K>>;
  }
}
