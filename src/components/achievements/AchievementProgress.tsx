import { Achievement } from '@ribbon-studios/guild-wars-2/v2';
import { ProgressBar } from '../common/ProgressBar';
import { api, ApiError } from '@/service/api';
import { useQuery } from '@tanstack/react-query';
import { AchievementBits } from './AchievementBits';
import { TuiTooltip } from '../common/TuiTooltip';
import type { UseEnhancedAchievements } from '@/hooks/use-enhanced-achievements';
import { useMemo, useState } from 'react';
import { cn } from '@/utils/cn';
import { TuiError } from '../common/TuiError';

export function AchievementProgress({ progress, tiers, className }: AchievementProgress.Props) {
  if (!progress) return null;

  const [error, setError] = useState<ApiError>();

  const {
    data: bits,
    refetch,
    isLoading,
  } = useQuery({
    enabled: false,
    queryKey: ['bits', progress.bits],
    queryFn: async () => {
      try {
        return await AchievementProgress.getBits(progress);
      } catch (error) {
        if (ApiError.is(error) && error.status === 404) {
          setError(error);
        }

        return null;
      }
    },
  });

  const markers = useMemo(() => tiers.map(({ count }) => count), [tiers]);

  if (progress.bits) {
    return (
      <TuiTooltip
        className={cn('max-w-full', className)}
        tooltipClassName={cn(error && 'min-w-full')}
        tooltip={
          error ? (
            <TuiError error={error} />
          ) : (
            <AchievementBits bits={bits?.bits} text={bits?.text} loading={isLoading} />
          )
        }
        onMouseOver={() => {
          if (isLoading || bits || error) return;

          refetch();
        }}
        allowLocking
      >
        <ProgressBar className="w-full" current={progress.current} max={progress.max} markers={markers} />
      </TuiTooltip>
    );
  }

  return (
    <ProgressBar className={cn('w-full', className)} current={progress.current} max={progress.max} markers={markers} />
  );
}

export namespace AchievementProgress {
  export type Props = {
    tiers: UseEnhancedAchievements.Achievement['tiers'];
    progress: UseEnhancedAchievements.Achievement['progress'];
    className?: string;
  };

  export type BitsByType = {
    [Achievement.Bit.Type.ITEM]: UseEnhancedAchievements.Bit.Item[];
    [Achievement.Bit.Type.MINIPET]: UseEnhancedAchievements.Bit.Minipet[];
    [Achievement.Bit.Type.SKIN]: UseEnhancedAchievements.Bit.Skin[];
    [Achievement.Bit.Type.TEXT]: UseEnhancedAchievements.Bit.Text[];
  };

  export type EnhancedBit = Pick<Achievement.Bit, 'text'> & {
    type: Achievement.Bit.Type;
    icon?: string;
    id?: number;
  };

  export type IconBit = {
    id: number;
    name: string;
    done: boolean;
    icon?: string;
    hint?: string;
  };

  export type GetBitsResponse = {
    bits: IconBit[];
    text: UseEnhancedAchievements.Bit.Text[];
  };

  export async function getBits(progress: UseEnhancedAchievements.Achievement['progress']): Promise<GetBitsResponse> {
    if (!progress?.bits) {
      return {
        bits: [],
        text: [],
      };
    }

    const bits_by_type = progress.bits.reduce<AchievementProgress.BitsByType>(
      (output, bit) => {
        output[bit.type].push(bit);

        return output;
      },
      {
        [Achievement.Bit.Type.ITEM]: [],
        [Achievement.Bit.Type.MINIPET]: [],
        [Achievement.Bit.Type.SKIN]: [],
        [Achievement.Bit.Type.TEXT]: [],
      }
    );

    const bits = await Promise.all([
      GetBits.getItems(bits_by_type[Achievement.Bit.Type.ITEM]),
      GetBits.getSkins(bits_by_type[Achievement.Bit.Type.SKIN]),
      GetBits.getMinis(bits_by_type[Achievement.Bit.Type.MINIPET]),
    ]);

    return {
      bits: bits
        .reduce((output, items) => output.concat(items))
        .sort((a, b) => {
          if (a.done === b.done) return 0;
          else if (a.done) return 1;
          else return -1;
        }),
      text: bits_by_type[Achievement.Bit.Type.TEXT],
    };
  }

  export namespace GetBits {
    export async function getItems(bits: UseEnhancedAchievements.Bit.Item[]): Promise<IconBit[]> {
      if (bits.length === 0) return [];

      const items = await api.v2.items.list({
        ids: bits.map(({ id }) => id),
      });

      return bits
        .map((bit) => {
          const item = items.find((item) => item.id === bit.id);

          if (!item) {
            console.error(`Failed to find item. (${bit.id})`);
            return undefined;
          }

          return {
            id: item.id,
            name: item.name,
            icon: item.icon,
            done: bit.done,
          };
        })
        .filter(Boolean) as IconBit[];
    }

    export async function getSkins(bits: UseEnhancedAchievements.Bit.Skin[]): Promise<IconBit[]> {
      if (bits.length === 0) return [];

      const skins = await api.v2.skins.list({
        ids: bits.map(({ id }) => id),
      });

      return bits
        .map((bit) => {
          const skin = skins.find((skin) => skin.id === bit.id);

          if (!skin) {
            console.error(`Failed to find skin. (${bit.id})`);
            return undefined;
          }

          return {
            id: skin.id,
            name: skin.name,
            icon: skin.icon,
            done: bit.done,
          };
        })
        .filter(Boolean) as IconBit[];
    }

    export async function getMinis(bits: UseEnhancedAchievements.Bit.Minipet[]): Promise<IconBit[]> {
      if (bits.length === 0) return [];

      const minis = await api.v2.minis.list({
        ids: bits.map(({ id }) => id),
      });

      return bits
        .map((bit) => {
          const mini = minis.find((mini) => mini.id === bit.id);

          if (!mini) {
            console.error(`Failed to find mini. (${bit.id})`);
            return undefined;
          }

          return {
            id: mini.id,
            name: mini.name,
            icon: mini.icon,
            done: bit.done,
            hint: mini.unlock,
          };
        })
        .filter(Boolean) as IconBit[];
    }

    export async function getText(bits: UseEnhancedAchievements.Bit.Text[]): Promise<GetBitsResponse['text']> {
      if (bits.length === 0) return [];

      return bits;
    }
  }
}
