import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Keyboard, ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import CurrencyDropdown from '../../components/Dropdown';
import styles from './styles';
import { useAppContext } from '../../context/appContext';
import { ICombinedAppState } from '../../store';
import { SOURCE_CURRENCIES } from '../../constants/conversion';
import ConversionController from '../../controllers/ConversionController';
import SwapButton from '../../components/SwapButton';
import TextInput from '../../components/TextInput';
import { debouncedFn } from '../../utils/common';
import { CONVERSION_DEBOUNCED_DELAY } from '../../constants/conversion';
import { ROUTES } from '../../navigation/routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase } from '@react-navigation/native';

const ConversionHome: React.FC = () => {
  const { colors } = useAppContext();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const style = styles(colors);
  const debouncedCheckRef = useRef<() => void>(null);
  const [enteredAmount, setEnteredAmount] = useState('');

  const {
    sourceCurrency,
    destinationCurrency,
    destinationCurrencies,
    rate,
  } = useSelector((state: ICombinedAppState) => state.conversionReducer);

  const handleSourceCurrencyChange = useCallback((currency: string) => {
    setEnteredAmount('');
    ConversionController.setAmount(0);
    ConversionController.setDestinationCurrency(undefined);
    ConversionController.setSourceCurrency(currency);
  }, []);

  const handleDestinationCurrencyChange = (currency: string) => {
    ConversionController.setDestinationCurrency(currency);
  };

  const handleCurrencySwap = () => {
    setEnteredAmount('');
    ConversionController.setAmount(0);
    ConversionController.swapCurrencies();
  };

  const handleAmountChange = useCallback((value: string) => {
    // Allow only numbers and decimal point
    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }

    const decimalValue = value.split('.')[1];
    if (decimalValue && decimalValue.length > 2) {
      return;
    }

    setEnteredAmount(value);
    const numberValue = parseFloat(value);

    if (!isNaN(numberValue)) {
      ConversionController.setAmount(numberValue);
    }
  }, []);

  const latestCheckRef = useRef<() => void>(() => {});

  latestCheckRef.current = () => {
    if (!sourceCurrency || !destinationCurrency || !rate || enteredAmount === '' || enteredAmount === '0') {
      return;
    }

    ConversionController.addToHistory(rate, Number(enteredAmount));
  };

  if (!debouncedCheckRef.current) {
    debouncedCheckRef.current = debouncedFn(() => {
      latestCheckRef.current();
    }, CONVERSION_DEBOUNCED_DELAY);
  }

  useEffect(() => {
    if (enteredAmount === '' || enteredAmount === '0') {
      return;
    }

    debouncedCheckRef.current?.();
  }, [enteredAmount, rate, sourceCurrency, destinationCurrency]);

  const handleNavigationToHistory = () => {
    Keyboard.dismiss();
    navigation.navigate(ROUTES.CONVERSION_HISTORY_SCREEN);
  };

  return (
    <ScrollView
      style={style.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <CurrencyDropdown
        label="From"
        value={sourceCurrency}
        options={Object.keys(SOURCE_CURRENCIES)}
        onSelect={handleSourceCurrencyChange}
      />

      <SwapButton
        onPress={handleCurrencySwap}
        disabled={!sourceCurrency || !destinationCurrency}
      />

      <CurrencyDropdown
        label="To"
        value={destinationCurrency}
        options={Object.keys(destinationCurrencies)}
        onSelect={handleDestinationCurrencyChange}
        disabled={!sourceCurrency}
      />

      {(!!sourceCurrency && !!destinationCurrency) ? (
        <Text style={style.amountText}>
          1 {sourceCurrency} = {Number(((1 * rate * 100) / 100).toFixed(2))} {destinationCurrency}
        </Text>
      ) : null}

      <View style={style.amountContainer}>
        <TextInput
          value={enteredAmount}
          onChange={handleAmountChange}
          editable={!!sourceCurrency && !!destinationCurrency}
          placeholder="Enter amount"
        />

        <TextInput
          value={(Math.round(Number(enteredAmount) * rate * 100) / 100).toFixed(2)}
          onChange={() => {}}
          editable={false}
          placeholder="Converted amount"
        />
      </View>

      <View style={style.buttonContainer}>
        <Button title="Go to conversion history" onPress={handleNavigationToHistory} />
      </View>
    </ScrollView>
  );
};

export default ConversionHome;
