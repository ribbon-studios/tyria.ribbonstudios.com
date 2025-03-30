import type { RGBColor } from 'colorthief';
import ColorThief from 'colorthief';

const ct = new ColorThief();

const color_cache: Record<string, Promise<RGBColor | null>> = {};
const palette_cache: Record<string, Promise<RGBColor[] | null>> = {};

export function getColor(src: string): Promise<RGBColor | null> {
  if (!color_cache[src]) {
    color_cache[src] = new Promise((resolve, reject) => {
      const img = new Image(64, 64);
      img.crossOrigin = 'anonymous';
      img.src = src;

      try {
        if (img.complete) {
          resolve(ct.getColor(img, 1));
        } else {
          img.addEventListener('load', () => {
            resolve(ct.getColor(img, 1));
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  return color_cache[src];
}

export function getPalette(src: string): Promise<RGBColor[] | null> {
  if (!palette_cache[src]) {
    palette_cache[src] = new Promise((resolve, reject) => {
      const img = new Image(64, 64);
      img.crossOrigin = 'anonymous';
      img.src = src;

      try {
        if (img.complete) {
          resolve(ct.getPalette(img, undefined, 1));
        } else {
          img.addEventListener('load', () => {
            resolve(ct.getPalette(img, undefined, 1));
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  return palette_cache[src];
}
