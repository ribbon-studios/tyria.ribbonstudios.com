import { TuiCard } from '@/components/common/TuiCard';
import { TuiInput } from '@/components/common/TuiInput';
import { $api, $background, $toggles, Background } from '@/store/settings';
import { delay } from '@ribbon-studios/js-utils';
import { useMutation } from '@tanstack/react-query';
import { useEffect, type FC } from 'react';
import { format } from 'date-fns';
import { TuiCheckbox } from '@/components/common/TuiCheckbox';
import { toast } from 'sonner';
import { UseValidate } from '@/hooks/use-validate';
import { TuiLink } from '@/components/common/TuiLink';
import { TuiSelect } from '@/components/common/TuiSelect';
import { TuiButton } from '@/components/common/TuiButton';
import { $loading, resetCache } from '@/store/api';
import { useStore } from '@nanostores/react';
import { api } from '@/service/api';
import { $header } from '@/store/app';
import { $category_masteries } from '@/store/mastery.slice';

export const Component: FC = () => {
  const { refresh_interval, key } = useStore($api);
  const toggles = useStore($toggles);
  const background = useStore($background);
  const loading = useStore($loading);

  useEffect(() => {
    $header.setKey('breadcrumbs', []);
  }, []);

  const {
    mutateAsync: verifyToken,
    submittedAt,
    isPending,
  } = useMutation({
    mutationFn: async (token: string | undefined) => {
      if (!token) {
        toast.info('API Key Updated', {
          description: 'Your achievement progress will no longer be tracked.',
        });

        return undefined;
      }

      toast.info('Verifying the API Key is valid...');

      try {
        const { permissions } = await delay(
          api.v2.tokeninfo({
            access_token: token,
          }),
          1000
        );

        if (!permissions.includes('account')) {
          throw new Error('Missing required permission!');
        }

        toast.success('API Key Updated', {
          description: 'Your achievement progress will now be tracked!',
        });
      } catch {
        toast.error('An error occurred while validating your API Key. Please re-verify and try again.');
      }
    },
  });

  return (
    <>
      <TuiCard className="mt-6">
        <div className="text-xl font-light">Settings</div>
        <TuiInput
          className="flex-1"
          label="Api Key"
          type="password"
          description={
            <>
              Your Guild Wars 2&nbsp;
              <TuiLink color="info" to="https://account.arena.net/applications" target="_blank">
                API Key
              </TuiLink>
              . (requires the account and progression scopes)
            </>
          }
          loading={isPending}
          value={key ?? ''}
          subtext={submittedAt === 0 ? undefined : `Last verified @ ${format(submittedAt, 'h:mm aa')}`}
          onChange={async (value) => {
            await verifyToken(value);

            $api.setKey('key', value);
            $category_masteries.set({});
          }}
          append={
            <TuiButton
              className="w-full md:w-auto"
              color="error"
              onClick={() => resetCache()}
              loading={loading}
              delay={100}
            >
              Reset Cache
            </TuiButton>
          }
        />
        <TuiInput
          className="flex-1"
          label="Auto-Refresh Interval"
          description="The time (in seconds) between auto refreshes."
          value={refresh_interval ?? undefined}
          prepend={
            <TuiCheckbox
              value={!!refresh_interval}
              onChange={(value) => {
                if (value) {
                  $api.setKey('refresh_interval', 30);

                  toast.success('Achievement progress will now be refreshed automatically!');
                } else {
                  $api.setKey('refresh_interval', null);

                  toast.success('Achievement progress will no longer be refreshed automatically.');
                }
              }}
            />
          }
          rules={[
            UseValidate.rules.number(),
            UseValidate.coerce.number(
              UseValidate.rules.min(10, 'Please avoid intervals less than 10s to avoid spamming the Guild Wars 2 API.')
            ),
          ]}
          disabled={refresh_interval === null}
          onChange={async (value) => {
            $api.setKey('refresh_interval', value ? Number(value) : null);

            toast.success('Auto-Refresh interval updated successfully.');
          }}
        />
        <TuiSelect
          align="left"
          label="Background"
          description="The background of the page."
          items={Background.LabelValues}
          value={background}
          onChange={(value) => $background.set(value)}
        />
        <div className="grid xl:grid-cols-2 gap-2">
          <div className="flex flex-col gap-2">
            <div className="text-xl font-light">Sticky Toggles</div>
            <div className="text-sm text-tui-muted">These toggles make various parts of the category page sticky.</div>
            <TuiCheckbox
              label="Incomplete Meta Achievements"
              value={toggles.pin_incomplete_meta_achievements}
              variant="toggle"
              onChange={(value) => $toggles.setKey('pin_incomplete_meta_achievements', value)}
            />
            <TuiCheckbox
              label="Search"
              value={toggles.pin_search}
              variant="toggle"
              onChange={(value) => $toggles.setKey('pin_search', value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-xl font-light">Visibility Toggles</div>
            <div className="text-sm text-tui-muted">
              Want to declutter the UI? Hide achievements based on their state!
            </div>
            <TuiCheckbox
              label="Hide Hidden Achievements"
              value={toggles.hide_hidden_achievements}
              variant="toggle"
              onChange={(value) => {
                $toggles.setKey('hide_hidden_achievements', value);

                if (value) {
                  toast.success('Hidden achievements will no longer be displayed.');
                } else {
                  toast.success('Hidden achievements will now be visible!');
                }
              }}
            />
            <TuiCheckbox
              label="Hide Completed Achievements"
              value={toggles.hide_completed_achievements}
              variant="toggle"
              onChange={(value) => {
                $toggles.setKey('hide_completed_achievements', value);

                if (value) {
                  toast.success('Achievements will now be hidden upon completion.');
                } else {
                  toast.success('Achievements will no longer be hidden upon completion.');
                }
              }}
            />
          </div>
          <div className="flex flex-col col-span-full gap-2">
            <div className="text-xl font-light">Miscelaneous Toggles</div>
            <div className="text-sm text-tui-muted">Toggles that just didn't make sense anywhere else!</div>
            <TuiCheckbox
              label="Debug Mode"
              value={toggles.debug_mode}
              variant="toggle"
              onChange={(value) => $toggles.setKey('debug_mode', value)}
            />
          </div>
        </div>
      </TuiCard>
    </>
  );
};
