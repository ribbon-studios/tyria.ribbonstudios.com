import { useEffect, useState, type ComponentProps, type FC, type ReactNode } from 'react';
import * as styles from './TuiSplash.module.css';
import { cn } from '@/utils/cn';
import { type RGBColor } from 'colorthief';
import { getPalette } from '@/utils/color';

const averageSaturation = ([r, g, b]: RGBColor) => {
  return (r + g + b) / 3;
};

const formatRGB = (
  [r, g, b]: RGBColor,
  options?: {
    saturation?: number;
    opacity?: number;
  }
) => {
  const { saturation, opacity } = {
    saturation: 1,
    opacity: 1,
    ...options,
  };

  const i = (r + g + b) / 3;
  const desaturation = (saturation - 1) * -1;
  const dr = i - r;
  const dg = i - g;
  const db = i - b;

  return `rgba(${r + dr * desaturation}, ${g + dg * desaturation}, ${b + db * desaturation}, ${opacity})`;
};

export const TuiSplash: FC<TuiSplash.Props> = ({ className, grayscale, image, ...props }) => {
  const [color, setColor] = useState<string>();

  useEffect(() => {
    getPalette(image).then((colors) => {
      if (colors) {
        const ideal = 160;
        const color = colors.reduce((currentColor, color) => {
          const currentDistance = Math.abs(averageSaturation(currentColor) - ideal);
          const distance = Math.abs(averageSaturation(color) - ideal);

          return currentDistance < distance ? currentColor : color;
        });

        if (grayscale) {
          setColor(undefined);
        } else {
          setColor(formatRGB(color));
        }
      } else {
        setColor(undefined);
      }
    });
  }, [image, grayscale]);

  return (
    <div
      {...props}
      className={cn(styles.splash, className)}
      style={{
        /* @ts-expect-error - TS Incorrectly marks CSS variables */
        '--tw-gradient-from': color,
      }}
    />
  );
};

export namespace TuiSplash {
  export type Props = {
    className?: string;
    image: string;
    grayscale?: boolean;
    children?: ReactNode;
  } & ComponentProps<'div'>;
}
