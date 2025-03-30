'use client';

import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export function formatDate(date: Date | string) {
  const dateObject = typeof date === 'string' ? new Date(date) : date;
  return format(dateObject, "d MMMM yyyy", { locale: tr });
}