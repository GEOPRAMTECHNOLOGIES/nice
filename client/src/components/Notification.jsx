import React, { useEffect } from 'react';
import { useStore } from '../store';

function Notification() {
  const { ui, hideNotification } = useStore();

  useEffect(() => {
    if (ui.showNotification) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [ui.showNotification, hideNotification]);

  if (!ui.showNotification) return null;

  const icons = {
    success: '✓',
    error: '✕',
    warning: '!',
    info: 'ⓘ',
  };

  return (
    <div className="notification">
      <div className={`notification-box ${ui.notification.type}`}>
        <span className="notification-icon">{icons[ui.notification.type]}</span>
        <span>{ui.notification.message}</span>
      </div>
    </div>
  );
}

export default Notification;
