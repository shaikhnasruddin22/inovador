import { FAQItem } from '@/types';
import faqData from '@/data/faq.json';

export async function getFAQs(): Promise<FAQItem[]> {
  return (faqData as FAQItem[]).sort((a, b) => a.sortOrder - b.sortOrder);
}
