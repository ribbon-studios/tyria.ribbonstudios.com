export namespace Better {
  export type Partial<T, K extends keyof T> = Omit<T, K> & globalThis.Partial<Pick<T, K>>;

  export namespace Partial {
    export type Inverse<T, K extends keyof T> = Partial<T, Exclude<keyof T, K>>;
  }
}
