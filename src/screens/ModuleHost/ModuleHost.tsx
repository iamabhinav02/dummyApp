import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, ROUTES } from '../../navigation/routes';
import { RouteProp } from '@react-navigation/native';
import { getModuleById } from '../../modules/registry';
import { IModuleRootProps } from '../../types/modules';
import { Background, Card, Text } from '../../common/ui';
import styles from './styles';

const ModuleHost: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, typeof ROUTES.MODULE_HOST_SCREEN>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const moduleDefinition = getModuleById(route.params.moduleId);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [LoadedModule, setLoadedModule] = useState<React.ComponentType<IModuleRootProps> | null>(null);

  const style = styles();

  useEffect(() => {
    let isMounted = true;

    const loadModule = async () => {
      if (!moduleDefinition) {
        setError('Requested module is not available.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const moduleRoot = await moduleDefinition.loadRoot();
        if (isMounted) {
          setLoadedModule(() => moduleRoot);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load module. Please try again.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadModule();

    return () => {
      isMounted = false;
    };
  }, [moduleDefinition]);

  if (isLoading) {
    return (
      <Background style={style.background}>
        <View style={style.centered}>
          <ActivityIndicator size="large" />
          <Text variant="body">Loading mini-app...</Text>
        </View>
      </Background>
    );
  }

  if (error || !LoadedModule || !moduleDefinition) {
    return (
      <Background style={style.background}>
        <View style={style.container}>
          <Card>
            <Text variant="title">Unable to open module</Text>
            <Text variant="body">{error || 'Something went wrong while loading this module.'}</Text>
          </Card>
        </View>
      </Background>
    );
  }

  return (
    <LoadedModule
      moduleId={moduleDefinition.id}
      onClose={() => navigation.goBack()}
    />
  );
};

export default ModuleHost;
