import { ProcessStep } from '@/types';
import processData from '@/data/process.json';

export async function getProcessSteps(): Promise<ProcessStep[]> {
  return processData as ProcessStep[];
}
