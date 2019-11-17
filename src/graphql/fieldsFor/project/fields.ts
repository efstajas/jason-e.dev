import { Theme } from '@/store/modules/theme/theme.types';

export default {
  SLUG: 'slug',
  NAME: 'name',
  DATE: 'date',
  ROLE: 'role',
  SUBTITLE: 'subtitle',
  TOKENS: 'tokens',
  CONTENT: 'content',
  TOKENSDARK: 'tokens_dark',
  CREDIT: 'credit',
  ILLUSTRATION: 'illustration',
};

export interface FullProject {
  slug: string,
  name: string,
  date: string,
  role: string,
  subtitle: string,
  tokens: Theme,
  content: string,
  tokensDark: Theme,
  credit: string,
  illustration: string,
}

export type Project = Partial<FullProject>;
