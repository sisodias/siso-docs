import { WorkspaceDialogService } from '@affine/core/modules/dialogs';
import type { SettingTab } from '@affine/core/modules/dialogs/constant';
import { WorkbenchService } from '@affine/core/modules/workbench';
import { useService } from '@toeverything/infra';
import { useEffect, useRef } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { getSisoEmbedConfig } from '../../../../siso-bridge';

export const Component = () => {
  const workbenchService = useService(WorkbenchService);
  const workspaceDialogService = useService(WorkspaceDialogService);
  const workbench = workbenchService.workbench;

  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') ?? undefined;
  const scrollAnchor = searchParams.get('scrollAnchor') ?? undefined;

  const isOpened = useRef(false);
  const { embedded } = getSisoEmbedConfig();

  useEffect(() => {
    if (embedded) return;
    if (isOpened.current) {
      return;
    }
    isOpened.current = true; // prevent open multiple times
    workbench.openAll();
    workspaceDialogService.open('setting', {
      activeTab: tab as SettingTab,
      scrollAnchor,
    });
  }, [embedded, scrollAnchor, tab, workbench, workspaceDialogService]);

  if (embedded) {
    return <Navigate to="/all" replace />;
  }
  return null;
};
