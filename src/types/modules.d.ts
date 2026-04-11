import React from 'react';
import { MODULES } from '../constants/modules';

export type ModuleId = typeof MODULES[keyof typeof MODULES]['id'];

export type IModuleRootProps = {
  moduleId: ModuleId;
  onClose: () => void;
};

export type IModuleDefinition = {
  id: ModuleId;
  displayName: string;
  description?: string;
  icon: string;
  initialRoute: string;
  enabled?: boolean;
  analyticsKey?: string;
  loadRoot: () => Promise<React.ComponentType<IModuleRootProps>>;
};
