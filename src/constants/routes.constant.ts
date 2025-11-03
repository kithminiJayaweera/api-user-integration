import { Database, UserPlus, type LucideIcon } from 'lucide-react';

export const APP_ROUTES: { path: string; label: string; icon: LucideIcon }[] = [
  { path: '/', label: 'API Users', icon: Database },
  { path: '/newly-added', label: 'Newly Added Users', icon: UserPlus },
];