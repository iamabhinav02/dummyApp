import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { Background, Button, Text } from '../../../common/ui';
import { MODULES } from '../../../constants/modules';
import { CreditScoreController } from '../../../controllers/CreditScoreController';
import { ICombinedAppState } from '../../../store';
import ScoreBadge from '../components/ScoreBadge';
import { useCreditBand } from '../hooks/useCreditBand';
import styles from './styles';

type Props = {
  onClose: () => void;
  onViewTips: () => void;
};

const CreditScoreHomeScreen: React.FC<Props> = ({ onClose, onViewTips }) => {
  const style = styles();
  const { score, tips } = useSelector((state: ICombinedAppState) => state[MODULES.CREDITSCORE.reducerKey]);
  const band = useCreditBand(score);

  return (
    <Background style={style.background}>
      <View style={style.container}>
        <View style={style.header}>
          <Text variant="heading" style={{ flex: 0.75 }}>Credit Score Dashboard</Text>
          <Button title="Back to Hub" variant="secondary" onPress={onClose} />
        </View>

        <ScoreBadge score={score} />
        <Text variant="body">Current score band: {band}</Text>
        <Text variant="body">Active improvement tips: {tips.length}</Text>

        <View style={style.actions}>
          <Button title="Refresh mock score" onPress={() => CreditScoreController.refreshDashboard()} />
          <Button title="View tips" variant="secondary" onPress={onViewTips} />
        </View>
      </View>
    </Background>
  );
};

export default CreditScoreHomeScreen;
