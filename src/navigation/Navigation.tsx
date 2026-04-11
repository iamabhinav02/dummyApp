import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { ROUTES } from './routes';
import HubHome from '../screens/HubHome';
import ModuleHost from '../screens/ModuleHost';
import { RootStackParamList } from './routes';

const androidVersion = typeof Platform.Version === 'string'
  ? parseInt(Platform.Version, 10)
  : Platform.Version;

const screenOptions: NativeStackNavigationOptions = Platform.select<NativeStackNavigationOptions>({
  default: {
    headerShown: false,
    animation: 'simple_push' as const,
    animationDuration: 200,
  },
  android: {
    headerShown: false,
    // android 9 below doesnt support simple_push
    animation: (androidVersion > 28) ? 'simple_push' as const : 'ios_from_right' as const,
    animationDuration: 200,
  },
}) || {
  headerShown: false,
};

const StackNavigator = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (
    <StackNavigator.Navigator
      screenOptions={screenOptions}
      initialRouteName={ROUTES.HUB_HOME_SCREEN}
    >
      <StackNavigator.Screen
        name={ROUTES.HUB_HOME_SCREEN}
        component={HubHome}
      />
      <StackNavigator.Screen
        name={ROUTES.MODULE_HOST_SCREEN}
        component={ModuleHost}
      />
    </StackNavigator.Navigator>
  );
};

export default Navigation;
