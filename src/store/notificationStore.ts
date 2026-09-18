export interface CivicNotification {
  id: string;
  title: string;
  detail: string;
  createdAt: string;
  read: boolean;
  type: 'report' | 'status' | 'community' | 'ai';
}

const STORAGE_KEY = 'civicpulse_notifications';
let listeners: (() => void)[] = [];

function load(): CivicNotification[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function save(notifications: CivicNotification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.slice(0, 30)));
}

export const notificationStore = {
  notifications: load(),
  subscribe(listener: () => void) {
    listeners.push(listener);
    return () => { listeners = listeners.filter(item => item !== listener); };
  },
  notify() { listeners.forEach(listener => listener()); },
  add(notification: Omit<CivicNotification, 'id' | 'createdAt' | 'read'>) {
    const item: CivicNotification = { ...notification, id: `notification-${Date.now()}`, createdAt: new Date().toISOString(), read: false };
    this.notifications = [item, ...this.notifications];
    save(this.notifications);
    this.notify();
  },
  markAllRead() {
    this.notifications = this.notifications.map(item => ({ ...item, read: true }));
    save(this.notifications);
    this.notify();
  }
};

import { useEffect, useState } from 'react';

export function useNotifications() {
  const [, setVersion] = useState(0);
  useEffect(() => notificationStore.subscribe(() => setVersion(version => version + 1)), []);
  return {
    notifications: notificationStore.notifications,
    unreadCount: notificationStore.notifications.filter(item => !item.read).length,
    addNotification: notificationStore.add.bind(notificationStore),
    markAllRead: notificationStore.markAllRead.bind(notificationStore)
  };
}
