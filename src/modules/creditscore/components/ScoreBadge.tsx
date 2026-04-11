import React from 'react';
import { View } from 'react-native';
import { Background, Card, Text } from '../../../common/ui';
import styles from './styles';

type Props = {
  score: number;
};

const getRating = (score: number) => {
  if (score >= 750) {
    return 'Excellent';
  }
  if (score >= 700) {
    return 'Good';
  }
  if (score >= 650) {
    return 'Fair';
  }
  return 'Needs Work';
};

const ScoreBadge: React.FC<Props> = ({ score }) => {
  const style = styles();

  return (
    <Background>
      <Card style={style.card}>
        <View style={style.center}>
          <Text variant="heading">{score}</Text>
          <Text variant="title">{getRating(score)}</Text>
        </View>
      </Card>
    </Background>
  );
};

export default ScoreBadge;
