import { useState, useEffect } from 'react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource('/api/events');
    eventSource.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications(prev => [...prev, newNotification]);
    };
    return () => eventSource.close();
  }, []);

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      {notifications.map((notification, index) => (
        <div key={index} style={{ backgroundColor: '#1f2937', color: 'white', padding: '15px', marginBottom: '10px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <strong>{notification.type}</strong>
          <p>{notification.message}</p>
        </div>
      ))}
    </div>
  );
}