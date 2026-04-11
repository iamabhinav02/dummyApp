import { IModuleDefinition, ModuleId } from '../../types/modules';
import { MODULES } from '../../constants/modules';
import { ROUTES } from '../../navigation/routes';

const moduleRegistry: Record<ModuleId, IModuleDefinition> = {
  [MODULES.EXPENSES.id]: {
    id: MODULES.EXPENSES.id,
    displayName: MODULES.EXPENSES.displayName,
    description: MODULES.EXPENSES.description,
    icon: MODULES.EXPENSES.icon,
    initialRoute: ROUTES.MODULES.EXPENSES.HOME,
    analyticsKey: MODULES.EXPENSES.analyticsKey,
    enabled: true,
    loadRoot: async () => (await import('../expenses')).ModuleRoot,
  },
  [MODULES.CREDITSCORE.id]: {
    id: MODULES.CREDITSCORE.id,
    displayName: MODULES.CREDITSCORE.displayName,
    description: MODULES.CREDITSCORE.description,
    icon: MODULES.CREDITSCORE.icon,
    initialRoute: ROUTES.MODULES.CREDITSCORE.HOME,
    analyticsKey: MODULES.CREDITSCORE.analyticsKey,
    enabled: true,
    loadRoot: async () => (await import('../creditscore')).ModuleRoot,
  },
  [MODULES.GOALS.id]: {
    id: MODULES.GOALS.id,
    displayName: MODULES.GOALS.displayName,
    description: MODULES.GOALS.description,
    icon: MODULES.GOALS.icon,
    initialRoute: ROUTES.MODULES.GOALS.HOME,
    analyticsKey: MODULES.GOALS.analyticsKey,
    enabled: true,
    loadRoot: async () => (await import('../goals')).ModuleRoot,
  },
};

export const getEnabledModules = (): IModuleDefinition[] => {
  return Object.values(moduleRegistry).filter((moduleDefinition) => moduleDefinition.enabled);
};

export const getModuleById = (moduleId: ModuleId): IModuleDefinition | undefined => {
  return moduleRegistry[moduleId];
};
