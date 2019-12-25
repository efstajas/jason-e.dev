import { Token } from '@/store/modules/theme/theme.types';

export default (
  token: Token,
): string => `rgba(${token[0]},${token[1]},${token[2]},${token[3]})`;
