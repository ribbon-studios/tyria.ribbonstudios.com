import { Achievement, Schema, type Mini } from '@ribbon-studios/guild-wars-2/v2';
import { ProgressBar } from '../common/ProgressBar';
import { api, type EnhancedAchievement, type EnhancedBit } from '@/service/api';
import { useQuery } from '@tanstack/react-query';
import { AchievementBits } from './AchievementBits';
import { TuiTooltip } from '../common/TuiTooltip';

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
    progress: EnhancedAchievement['progress'];
  };

  export type BitsByType = {
    [Achievement.Bit.Type.ITEM]: EnhancedBit.Item[];
    [Achievement.Bit.Type.MINIPET]: EnhancedBit.Minipet[];
    [Achievement.Bit.Type.SKIN]: EnhancedBit.Skin[];
    [Achievement.Bit.Type.TEXT]: EnhancedBit.Text[];
  };

  export type EnhancedBit = Pick<Achievement.Bit, 'text'> & {
    type: Achievement.Bit.Type;
    icon?: string;
    id?: number;
  };

  export type GetBitsResponse = {
    items: EnhancedBit.Item[];
    skins: EnhancedBit.Skin[];
    minis: (EnhancedBit.Minipet & Mini<Schema.LATEST>)[];
    text: EnhancedBit.Text[];
  };

  export async function getBits(progress: EnhancedAchievement['progress']): Promise<GetBitsResponse> {
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
    export async function getItems(bits: EnhancedBit.Item[]): Promise<GetBitsResponse['items']> {
      if (bits.length === 0) return [];

      // TODO: Implement Support for Items...
      return bits;
    }

    export async function getSkins(bits: EnhancedBit.Skin[]): Promise<GetBitsResponse['skins']> {
      if (bits.length === 0) return [];

      // TODO: Implement Support for Skins...
      return bits;
    }

    export async function getMinis(bits: EnhancedBit.Minipet[]): Promise<GetBitsResponse['minis']> {
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

    export async function getText(bits: EnhancedBit.Text[]): Promise<EnhancedBit[]> {
      if (bits.length === 0) return [];

      return bits;
    }
  }
}
