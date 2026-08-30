import { useLiveData, useService } from '@toeverything/infra';

import { WorkspaceNavigator } from '@affine/core/components/workspace-selector';
import { getSisoEmbedConfig } from '../../../../siso-bridge';
import { AppSidebarService } from '../../services/app-sidebar';
import { AddPageButton } from '../add-page-button';
import {
  embeddedHeaderContent,
  embeddedWorkspace,
  navHeaderStyle,
} from '../index.css';
import { SidebarSwitch } from './sidebar-switch';

export const SidebarHeader = () => {
  const appSidebarService = useService(AppSidebarService).sidebar;
  const open = useLiveData(appSidebarService.open$);
  const { embedded } = getSisoEmbedConfig();

  return (
    <div className={navHeaderStyle} data-open={open}>
      {embedded ? (
        <div className={embeddedHeaderContent}>
          <SidebarSwitch show={open} />
          <div className={embeddedWorkspace}>
            <WorkspaceNavigator showSyncStatus dense disable />
          </div>
          <AddPageButton />
        </div>
      ) : (
        <SidebarSwitch show={open} />
      )}
    </div>
  );
};

export * from './sidebar-switch';
