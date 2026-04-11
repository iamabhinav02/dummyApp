import React from 'react';
import { FlatList, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Background, Button, Card, Text } from '../../../common/ui';
import { MODULES } from '../../../constants/modules';
import { ICombinedAppState } from '../../../store';
import { ICreditTip } from '../../../types/reducers';
import styles from './styles';

type Props = {
  onBack: () => void;
};

const CreditTipsScreen: React.FC<Props> = ({ onBack }) => {
  const style = styles();
  const tips = useSelector((state: ICombinedAppState) => state[MODULES.CREDITSCORE.reducerKey].tips);

  const renderTip = ({ item }: { item: ICreditTip }) => (
    <Card style={style.tipCard}>
      <Text variant="title">{item.title}</Text>
      <Text variant="body">{item.description}</Text>
    </Card>
  );

  return (
    <Background style={style.background}>
      <View style={style.container}>
        <View style={style.header}>
          <Text variant="heading">Improvement Tips</Text>
          <Button title="Back" variant="secondary" onPress={onBack} />
        </View>

        <FlatList
          data={tips}
          keyExtractor={(item) => item.id}
          renderItem={renderTip}
          contentContainerStyle={style.listContent}
        />
      </View>
    </Background>
  );
};

export default CreditTipsScreen;
