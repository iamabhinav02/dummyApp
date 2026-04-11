import React from 'react';
import { FlatList, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon } from 'react-native-paper';
import { useAppContext } from '../../context/appContext';
import { getEnabledModules } from '../../modules/registry';
import { ROUTES, RootStackParamList } from '../../navigation/routes';
import { IModuleDefinition } from '../../types/modules';
import { Background, Button, Card, Text } from '../../common/ui';
import styles from './styles';
import { THEME_TYPE } from '../../enums/common';

const HubHome: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { toggleTheme, theme } = useAppContext();
  const style = styles();
  const modules = getEnabledModules();

  const handleOpenModule = (module: IModuleDefinition) => {
    navigation.navigate(ROUTES.MODULE_HOST_SCREEN, { moduleId: module.id });
  };

  const renderModule = ({ item }: { item: IModuleDefinition }) => (
    <Card style={style.moduleCard}>
      <View style={style.moduleHeader}>
        <View style={style.moduleTitleWrap}>
          <Icon source={item.icon} size={20} />
          <Text variant="title">{item.displayName}</Text>
        </View>
      </View>
      {!!item.description && <Text variant="body">{item.description}</Text>}
      <View style={style.moduleAction}>
        <Button title="Open mini-app" onPress={() => handleOpenModule(item)} />
      </View>
    </Card>
  );

  return (
    <Background style={style.background}>
      <View style={style.container}>
        <View style={style.header}>
          <Text variant="heading">Bright Hub</Text>
          <Button
            title={theme === THEME_TYPE.LIGHT ? 'Dark mode' : 'Light mode'}
            variant="secondary"
            onPress={toggleTheme}
          />
        </View>

        <Text variant="body" style={style.subtitle}>
          Launch any module from this container shell.
        </Text>

        <FlatList
          data={modules}
          keyExtractor={(item) => item.id}
          renderItem={renderModule}
          contentContainerStyle={style.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Background>
  );
};

export default HubHome;
