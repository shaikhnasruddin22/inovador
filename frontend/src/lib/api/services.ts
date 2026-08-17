import { Service } from '@/types';
import servicesData from '@/data/services.json';

export async function getServices(): Promise<Service[]> {
  return (servicesData as Service[]).sort((a, b) => a.sortOrder - b.sortOrder);
}
