import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Deeply merges two objects or arrays. Arrays are merged by index, objects by key.
 * Source values override target values, but missing fields in source are filled from target.
 * Does not mutate inputs.
 */
// Overloads for arrays and objects
export function deepMerge<T extends object>(target: T, source: Partial<T>): T;
export function deepMerge<T>(target: T[], source: Partial<T>[]): T[];
export function deepMerge(target: any, source: any): any {
  if (Array.isArray(target) && Array.isArray(source)) {
    // Merge arrays by index
    return target.map((item, idx) => {
      if (idx < source.length) {
        return deepMerge(item, source[idx]);
      }
      return item;
    });
  } else if (isObject(target) && isObject(source)) {
    const result: any = { ...target };
    for (const key in source) {
      if (source[key] === undefined) continue;
      if (key in target && isObject(target[key]) && isObject(source[key])) {
        result[key] = deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }
  return source !== undefined ? source : target;
}

function isObject(item: any): item is Record<string, any> {
  return !!item && typeof item === 'object' && !Array.isArray(item);
}
