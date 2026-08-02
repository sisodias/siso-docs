import {
  Avatar,
  Divider,
  IconButton,
  Menu,
  type MenuProps,
} from '@affine/component';
import {
  type AuthAccountInfo,
  AuthService,
  ServerService,
} from '@affine/core/modules/cloud';
import { GlobalDialogService } from '@affine/core/modules/dialogs';
import { useLiveData, useService } from '@toeverything/infra';
import { useCallback } from 'react';

import { navigateSisoHost, useSisoHostUser } from '../../../siso-bridge';
import { Account } from './account';
import { AccountMenu } from './account-menu';
import { AIUsage } from './ai-usage';
import { CloudUsage } from './cloud-usage';
import * as styles from './index.css';
import { TeamList } from './team-list';
import { UnknownUserIcon } from './unknow-user';

export default function UserInfo() {
  const session = useService(AuthService).session;
  const account = useLiveData(session.account$);
  const sisoUser = useSisoHostUser();
  if (sisoUser) {
    return (
      <IconButton
        data-testid="sidebar-siso-user-avatar"
        variant="plain"
        size="20"
        style={{ padding: 0 }}
        withoutHover
        title={`${sisoUser.name} · ${sisoUser.email}`}
        onClick={() => navigateSisoHost('/settings?tab=profile')}
      >
        <Avatar size={20} name={sisoUser.name} />
      </IconButton>
    );
  }
  return account ? (
    <AuthorizedUserInfo account={account} />
  ) : (
    <UnauthorizedUserInfo />
  );
}

const menuContentOptions: MenuProps['contentOptions'] = {
  className: styles.operationMenu,
};
const AuthorizedUserInfo = ({ account }: { account: AuthAccountInfo }) => {
  return (
    <Menu items={<OperationMenu />} contentOptions={menuContentOptions}>
      <IconButton
        data-testid="sidebar-user-avatar"
        variant="plain"
        size="20"
        style={{ padding: 0 }}
        withoutHover
      >
        <Avatar size={20} name={account.label} url={account.avatar} />
      </IconButton>
    </Menu>
  );
};

const UnauthorizedUserInfo = () => {
  const globalDialogService = useService(GlobalDialogService);

  const openSignInModal = useCallback(() => {
    if (navigateSisoHost('/settings?tab=profile')) return;
    globalDialogService.open('sign-in', {});
  }, [globalDialogService]);

  return (
    <IconButton
      onClick={openSignInModal}
      data-testid="sidebar-user-avatar"
      variant="plain"
      size="20"
    >
      <UnknownUserIcon />
    </IconButton>
  );
};

const OperationMenu = () => {
  const serverService = useService(ServerService);
  const serverFeatures = useLiveData(serverService.server.features$);

  return (
    <>
      <Account />
      <Divider />
      <CloudUsage />
      {serverFeatures?.copilot ? <AIUsage /> : null}
      <Divider />
      <TeamList />
      <AccountMenu />
    </>
  );
};
