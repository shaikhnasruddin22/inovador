import { AwardOrPress } from '@/types';
import awardsData from '@/data/awards.json';

export async function getAwards(): Promise<AwardOrPress[]> {
  return awardsData as AwardOrPress[];
}
