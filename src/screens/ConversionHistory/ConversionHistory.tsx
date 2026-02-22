import React from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase } from '@react-navigation/native';
import styles from './styles';
import { useAppContext } from '../../context/appContext';
import { ICombinedAppState } from '../../store';
import { Icon } from 'react-native-paper';
import { formatDate } from '../../utils/common';

const ConversionHistory: React.FC = () => {
  const { colors } = useAppContext();
  const style = styles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const {
    conversionHistory,
  } = useSelector((state: ICombinedAppState) => state.conversionReducer);

  return (
    <ScrollView
      style={style.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={style.headerContainer}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()}>
          <Icon source="arrow-left" size={16} color={colors.TEXT.PRIMARY} />
        </TouchableOpacity>
        <Text style={style.headerText}>Conversion History</Text>
      </View>
      {conversionHistory.map((item, index) => (
        <View key={item.id} style={style.itemContainer}>
          <Text style={style.itemText}>
            {index + 1}.  {item.amount} {item.sourceCurrency} = {item.convertedAmount} {item.destinationCurrency}
          </Text>
          <Text style={style.timestamp}>
            {formatDate(new Date(item.timestamp))}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default ConversionHistory;
