import React from 'react';
import { Modal, Pressable, View } from 'react-native';
import { useAppContext } from '../../../context/appContext';
import useStyles from './styles';

type Props = {
  visible: boolean;
  onClose: () => void;
  /** Show the drag handle at the top of the sheet. Defaults to true. */
  showHandle?: boolean;
  children: React.ReactNode;
};

/**
 * Bottom-anchored modal sheet with a scrim backdrop that dismisses on press.
 * Content-agnostic — callers render whatever rows/controls they need inside.
 */
const BottomSheet: React.FC<Props> = ({
  visible,
  onClose,
  showHandle = true,
  children,
}) => {
  const { colors } = useAppContext();
  const styles = useStyles(colors);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* Stop propagation so taps on the sheet don't dismiss it. */}
        <Pressable style={styles.sheet} onPress={() => {}}>
          {showHandle && <View style={styles.handle} />}
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default BottomSheet;
