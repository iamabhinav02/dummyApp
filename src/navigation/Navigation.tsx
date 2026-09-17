import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { ROUTES, RootStackParamList } from './routes';
import { ConversationScreen } from '../features/conversation';

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
      initialRouteName={ROUTES.CONVERSATION_SCREEN}
    >
      <StackNavigator.Screen
        name={ROUTES.CONVERSATION_SCREEN}
        component={ConversationScreen}
      />
    </StackNavigator.Navigator>
  );
};

export default Navigation;
