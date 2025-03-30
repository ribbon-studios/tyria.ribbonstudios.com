declare module '*.module.css' {
  const content: Record<string, string>;
  export default content;
  export = content;
}

declare module 'colorthief' {
  export type RGBColor = [number, number, number];
  export default class ColorThief {
    getColor: (img: HTMLImageElement | null, quality: number = 10) => RGBColor | null;
    getPalette: (img: HTMLImageElement | null, colorCount: number = 10, quality: number = 10) => RGBColor[] | null;
  }
}
