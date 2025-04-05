import { Achievement, Schema, type Mini } from '@ribbon-studios/guild-wars-2/v2';
import { ProgressBar } from '../common/ProgressBar';
import { api } from '@/service/api';
import { useQuery } from '@tanstack/react-query';
import { AchievementBits } from './AchievementBits';
import { TuiTooltip } from '../common/TuiTooltip';
import type { UseEnhancedAchievements } from '@/hooks/use-enhanced-achievements';

export function AchievementProgress({ progress }: AchievementProgress.Props) {
  if (!progress) return null;

  const {
    data: bits,
    refetch,
    isLoading,
  } = useQuery({
    enabled: false,
    queryKey: ['bits', progress.bits],
    queryFn: () => AchievementProgress.getBits(progress),
  });

  if (progress.bits) {
    return (
      <TuiTooltip
        className="max-w-full"
        tooltip={<AchievementBits bits={bits} loading={isLoading} />}
        onMouseOver={() => {
          if (isLoading || bits) return;

          refetch();
        }}
        allowLocking
      >
        <ProgressBar className="w-full" current={progress.current} max={progress.max} />
      </TuiTooltip>
    );
  }

  return <ProgressBar className="w-full" current={progress.current} max={progress.max} />;
}

export namespace AchievementProgress {
  export type Props = {
    progress: UseEnhancedAchievements.Achievement['progress'];
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

  export type GetBitsResponse = {
    items: UseEnhancedAchievements.Bit.Item[];
    skins: UseEnhancedAchievements.Bit.Skin[];
    minis: (UseEnhancedAchievements.Bit.Minipet & Mini<Schema.LATEST>)[];
    text: UseEnhancedAchievements.Bit.Text[];
  };

  export async function getBits(progress: UseEnhancedAchievements.Achievement['progress']): Promise<GetBitsResponse> {
    if (!progress?.bits) {
      return {
        minis: [],
        items: [],
        skins: [],
        text: [],
      };
    }

    const bits = progress.bits.reduce<AchievementProgress.BitsByType>(
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

    const [items, skins, minis] = await Promise.all([
      GetBits.getItems(bits[Achievement.Bit.Type.ITEM]),
      GetBits.getSkins(bits[Achievement.Bit.Type.SKIN]),
      GetBits.getMinis(bits[Achievement.Bit.Type.MINIPET]),
    ]);

    return {
      items,
      skins,
      minis,
      text: bits[Achievement.Bit.Type.TEXT],
    };
  }

  export namespace GetBits {
    export async function getItems(bits: UseEnhancedAchievements.Bit.Item[]): Promise<GetBitsResponse['items']> {
      if (bits.length === 0) return [];

      // TODO: Implement Support for Items...
      return bits;
    }

    export async function getSkins(bits: UseEnhancedAchievements.Bit.Skin[]): Promise<GetBitsResponse['skins']> {
      if (bits.length === 0) return [];

      // TODO: Implement Support for Skins...
      return bits;
    }

    export async function getMinis(bits: UseEnhancedAchievements.Bit.Minipet[]): Promise<GetBitsResponse['minis']> {
      if (bits.length === 0) return [];

      const minis = await api.v2.minis.list({
        ids: bits.map(({ id }) => id),
      });

      return bits.map((bit) => {
        const mini = minis.find((mini) => mini.id === bit.id);

        return {
          ...bit,
          ...mini!,
        };
      });
    }

    export async function getText(bits: UseEnhancedAchievements.Bit.Text[]): Promise<GetBitsResponse['text']> {
      if (bits.length === 0) return [];

      return bits;
    }
  }
}
