import { RibbonCard } from '@/components/common/RibbonCard';

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-2 p-2">
      <RibbonCard className="grid grid-cols-1 xl:grid-cols-2">
        <div>My Content</div>
        <div>My Content</div>
        <div>My Content</div>
        <div>My Content</div>
      </RibbonCard>
    </div>
  );
}
