import React from 'react';
import { MESSAGE_AUTHOR } from '../../../../enums/conversation';
import { MessageAuthorType } from '../../../../types/conversation';
import { MessageComponentProps } from './messageTypes';
import UserMessage from './UserMessage';
import AIMessage from './AIMessage';
import HumanMessage from './HumanMessage';
import SystemMessage from './SystemMessage';

/**
 * Maps a message author type to its renderer. New author types can be added by
 * registering a component here — the timeline stays untouched.
 */
const messageRegistry: Record<MessageAuthorType, React.FC<MessageComponentProps>> = {
  [MESSAGE_AUTHOR.USER]: UserMessage,
  [MESSAGE_AUTHOR.AI]: AIMessage,
  [MESSAGE_AUTHOR.HUMAN]: HumanMessage,
  [MESSAGE_AUTHOR.SYSTEM]: SystemMessage,
};

export const getMessageComponent = (
  type: MessageAuthorType,
): React.FC<MessageComponentProps> => messageRegistry[type] ?? SystemMessage;
