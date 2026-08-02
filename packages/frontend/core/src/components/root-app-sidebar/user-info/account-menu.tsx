import { MenuItem } from '@affine/component';
import { WorkspaceDialogService } from '@affine/core/modules/dialogs';
import { useI18n } from '@affine/i18n';
import { track } from '@affine/track';
import { AccountIcon } from '@blocksuite/icons/rc';
import { useService } from '@toeverything/infra';
import { useCallback } from 'react';

import { navigateSisoHost } from '../../../siso-bridge';

export const AccountMenu = () => {
  const workspaceDialogService = useService(WorkspaceDialogService);
  const t = useI18n();
  const onOpenAccountSetting = useCallback(() => {
    if (navigateSisoHost('/settings?tab=profile')) return;
    track.$.navigationPanel.profileAndBadge.openSettings({ to: 'account' });
    workspaceDialogService.open('setting', { activeTab: 'account' });
  }, [workspaceDialogService]);

  return (
    <>
      <MenuItem
        prefixIcon={<AccountIcon />}
        data-testid="workspace-modal-account-settings-option"
        onClick={onOpenAccountSetting}
      >
        {t['com.affine.workspace.cloud.account.settings']()}
      </MenuItem>
    </>
  );
};
