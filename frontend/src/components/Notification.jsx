import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Notification({ message, type = 'success', onClose }) {
  if (!message) return null;

  return (
    <div className={`notification-toast ${type}`} role="alert">
      {type === 'success' ? (
        <CheckCircle2 size={20} />
      ) : (
        <AlertCircle size={20} />
      )}
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{ marginLeft: '0.8rem', color: '#fff', opacity: 0.8 }}
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
