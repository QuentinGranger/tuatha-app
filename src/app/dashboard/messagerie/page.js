'use client';

import React, { useState } from 'react';
import { MessageProvider } from '@/contexts/MessageContext';
import ConversationList from './components/ConversationList';
import ChatWindow from './components/ChatWindow';
import NewMessageModal from './components/NewMessageModal';
import styles from './page.module.css';

export default function Messagerie() {
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  
  const handleNewMessage = () => {
    setShowNewMessageModal(true);
  };
  
  return (
    <MessageProvider>
      <div className={styles.messagingContainer}>
        <div className={styles.messagingLayout}>
          <div className={styles.sidebarColumn}>
            <ConversationList onNewMessage={handleNewMessage} />
          </div>
          <div className={styles.mainColumn}>
            <ChatWindow />
          </div>
        </div>
        
        {showNewMessageModal && (
          <NewMessageModal onClose={() => setShowNewMessageModal(false)} />
        )}
      </div>
    </MessageProvider>
  );
}
