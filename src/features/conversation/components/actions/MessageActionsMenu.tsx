import React from 'react';
import { Pressable } from 'react-native';
import { Icon } from 'react-native-paper';
import { useAppContext } from '../../../../context/appContext';
import Text from '../../../../common/ui/Text';
import BottomSheet from '../../../../common/ui/BottomSheet';
import { Message } from '../../../../types/conversation';
import useStyles from './styles';

type Props = {
  message: Message | null;
  onClose: () => void;
  onReply: (message: Message) => void;
  onCopy: (message: Message) => void;
  onDelete: (message: Message) => void;
};

type Action = {
  key: string;
  label: string;
  icon: string;
  destructive?: boolean;
  run: (message: Message) => void;
};

/** Long-press action sheet for a message (Reply / Copy / Delete). */
const MessageActionsMenu: React.FC<Props> = ({
  message,
  onClose,
  onReply,
  onCopy,
  onDelete,
}) => {
  const { colors } = useAppContext();
  const styles = useStyles(colors);

  const actions: Action[] = [
    { key: 'reply', label: 'Reply', icon: 'reply', run: onReply },
    { key: 'copy', label: 'Copy', icon: 'content-copy', run: onCopy },
    { key: 'delete', label: 'Delete', icon: 'trash-can-outline', destructive: true, run: onDelete },
  ];

  return (
    <BottomSheet visible={!!message} onClose={onClose}>
      {actions.map((action) => (
        <Pressable
          key={action.key}
          style={styles.action}
          onPress={() => message && action.run(message)}
          accessibilityRole="button"
        >
          <Icon
            source={action.icon}
            size={20}
            color={action.destructive ? colors.STATUS.DANGER : colors.TEXT.PRIMARY}
          />
          <Text
            variant="body"
            style={action.destructive ? styles.actionLabelDestructive : styles.actionLabel}
          >
            {action.label}
          </Text>
        </Pressable>
      ))}
    </BottomSheet>
  );
};

export default MessageActionsMenu;
