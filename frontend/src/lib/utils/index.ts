export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatYear(year: number): string {
  return year.toString();
}

export function formatCategory(cat: string): string {
  return cat.toUpperCase();
}
