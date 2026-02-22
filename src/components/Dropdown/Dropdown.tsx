import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, Pressable, FlatList, Keyboard } from 'react-native';
import { Portal } from '@gorhom/portal';
import { getCurrencyDisplay } from '../../utils/conversion';
import styles from './styles';
import { useAppContext } from '../../context/appContext';
import RadioButton from '../RadioButton';

interface Props {
  label: string;
  value?: string;
  options: string[];
  onSelect: (value: string) => void;
  disabled?: boolean;
}

const Dropdown: React.FC<Props> = ({
  label,
  value,
  options,
  onSelect,
  disabled,
}) => {
  const { colors } = useAppContext();
  const style = styles(colors);

  const [visible, setVisible] = useState(false);

  const selectedDisplay = useMemo(() => value ? getCurrencyDisplay(value) : null, [value]);

  const close = () => setVisible(false);

  const handleSelect = useCallback((code: string) => {
    onSelect(code);
    close();
  }, [onSelect]);

  const handleOpenPortal = useCallback(() => {
    Keyboard.dismiss();
    requestAnimationFrame(() => {
      setVisible(true);
    });
  }, []);

  const EmptyComponent = useCallback(() => (
    <Text style={style.emptyText}>No currencies found</Text>
  ), [style.emptyText]);

  const renderItem = useCallback(({ item }: { item: string }) => {
    const { label, flag } = getCurrencyDisplay(item);
    const selected = item === value;

    return (
      <RadioButton
        selected={selected}
        label={`${flag}  ${label}`}
        handleSelect={() => handleSelect(item)}
      />
    );
  }, [handleSelect, value]);

  return (
    <>
      <View style={style.container}>
        <Text style={style.label}>{label}</Text>
        <Pressable
          disabled={disabled}
          style={[
            style.trigger,
            disabled && style.disabled,
          ]}
          onPress={handleOpenPortal}
          accessibilityRole="button"
        >
          <Text style={style.triggerText}>
            {selectedDisplay
              ? `${selectedDisplay.flag}  ${selectedDisplay.label}`
              : 'Select'}
          </Text>
        </Pressable>
      </View>

      {visible && (
        <Portal>
          <Pressable style={style.backdrop} onPress={close} />

          <View style={style.sheet}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              ListEmptyComponent={EmptyComponent}
              renderItem={renderItem}
            />
          </View>
        </Portal>
      )}
    </>
  );
};

export default Dropdown;
