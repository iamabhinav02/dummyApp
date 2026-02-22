import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { ROUTES } from './routes';
import ConversionHome from '../screens/ConversionHome';
import ConversionHistory from '../screens/ConversionHistory';

const screenOptions = Platform.select({
  default: {
    headerShown: false,
    animation: 'simple_push',
    cardShadowEnabled: false,
    cardOverlayEnabled: false,
    animationDuration: 200,
  },
  android: {
    headerShown: false,
    // android 9 below doesnt support simple_push
    animation: (parseInt(Platform.Version, 10) > 28) ? 'simple_push' : 'ios_from_right',
    cardShadowEnabled: false,
    cardOverlayEnabled: false,
    animationDuration: 200,
  },
});

const StackNavigator = createNativeStackNavigator();

const Navigation = () => {
  return (
    <StackNavigator.Navigator
      screenOptions={screenOptions}
      initialRouteName={ROUTES.CONVERSION_HOME_SCREEN}
    >
      <StackNavigator.Screen
        name={ROUTES.CONVERSION_HOME_SCREEN}
        component={ConversionHome}
      />
      <StackNavigator.Screen
        name={ROUTES.CONVERSION_HISTORY_SCREEN}
        component={ConversionHistory}
      />
    </StackNavigator.Navigator>
  );
};

export default Navigation;
