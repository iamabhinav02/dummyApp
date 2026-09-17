import React from 'react';
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
  user: UserMessage,
  ai: AIMessage,
  human: HumanMessage,
  system: SystemMessage,
};

export const getMessageComponent = (
  type: MessageAuthorType,
): React.FC<MessageComponentProps> => messageRegistry[type] ?? SystemMessage;
