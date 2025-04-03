import { Card } from '@/components/common/Card';
import { TuiInput } from '@/components/common/TuiInput';
import { api } from '@/service/api';
import { useAppDispatch } from '@/store';
import { Background, selectSettings, setApiKey, setApiSetting, setBackground, setToggle } from '@/store/settings.slice';
import { delay } from '@ribbon-studios/js-utils';
import { useMutation } from '@tanstack/react-query';
import { useEffect, type FC } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { TuiCheckbox } from '@/components/common/TuiCheckbox';
import { toast } from 'sonner';
import { UseValidate } from '@/hooks/use-validate';
import { setHeader } from '@/store/app.slice';
import { TuiLink } from '@/components/common/TuiLink';
import { resetTrueMastery } from '@/store/true-mastery.slice';
import { TuiSelect } from '@/components/common/TuiSelect';

export const Component: FC = () => {
  const dispatch = useAppDispatch();
  const settings = useSelector(selectSettings);

  useEffect(() => {
    dispatch(
      setHeader({
        breadcrumbs: [
          {
            label: 'Settings',
          },
        ],
        image: '',
      })
    );
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
    <div className="flex flex-col flex-1 p-6 m-auto gap-2 w-full max-w-[1200px]">
      <Card className="flex-col">
        <div className="text-xl font-light">Settings</div>
        <TuiInput
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
          value={settings.api.key ?? ''}
          subtext={submittedAt === 0 ? undefined : `Last verified @ ${format(submittedAt, 'h:mm aa')}`}
          onChange={async (value) => {
            await verifyToken(value);

            dispatch(setApiKey(value));
            dispatch(resetTrueMastery());
          }}
        />
        <TuiInput
          className="flex-1"
          label="Auto-Refresh Interval"
          description="The time (in seconds) between auto refreshes."
          value={settings.api.refresh_interval ?? ''}
          prepend={
            <TuiCheckbox
              value={!!settings.api.refresh_interval}
              onChange={(value) => {
                dispatch(setApiSetting(['refresh_interval', value ? 30 : null]));
              }}
            />
          }
          rules={[
            UseValidate.rules.number(),
            UseValidate.coerce.number(
              UseValidate.rules.min(10, 'Please avoid intervals less than 10s to avoid spamming the Guild Wars 2 API.')
            ),
          ]}
          disabled={!settings.api.refresh_interval}
          onChange={async (value) => {
            dispatch(setApiSetting(['refresh_interval', value ? Number(value) : null]));

            toast.success('Auto-Refresh interval updated successfully.');
          }}
        />
        <TuiSelect
          align="left"
          label="Background"
          description="The background of the page."
          items={Background.LabelValues}
          value={settings.background}
          onChange={(value) => dispatch(setBackground(value))}
        />
        <div className="text-xl font-light">Toggles</div>
        <TuiCheckbox
          label="Hide Completed Achievements"
          value={settings.toggles.hide_completed_achievements}
          variant="toggle"
          onChange={(value) => {
            dispatch(setToggle(['hide_completed_achievements', value]));

            if (value) {
              toast.success('Achievements will now be hidden upon completion.');
            } else {
              toast.success('Achievements will no longer be hidden upon completion.');
            }
          }}
        />
        <TuiCheckbox
          label="Make Incomplete Meta Achievements Sticky"
          value={settings.toggles.pin_incomplete_meta_achievements}
          variant="toggle"
          onChange={(value) => dispatch(setToggle(['pin_incomplete_meta_achievements', value]))}
        />
        <TuiCheckbox
          label="Debug Mode"
          value={settings.toggles.debug_mode}
          variant="toggle"
          onChange={(value) => dispatch(setToggle(['debug_mode', value]))}
        />
      </Card>
    </div>
  );
};
