import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 延迟
 * @param time 毫秒
 */
export const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));
