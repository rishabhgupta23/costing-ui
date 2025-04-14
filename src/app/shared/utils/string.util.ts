export function getValueOrNull<T>(value: T | null | undefined): T {
    if (value !== null && value !== undefined) return value;
  
    const type = typeof value;
  
    if (type === 'string') return '' as T;
    if (type === 'number') return 0 as T;
    if (Array.isArray(value)) return [] as T;
  
    return null as T;
  }
  