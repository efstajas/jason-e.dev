import { Token } from '@/store/modules/theme/theme.types';

// eslint-disable-next-line no-bitwise
const rgbToHex = (r: number, g: number, b: number) => `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

export default (token: Token) => {
  (document.getElementById('themeColor'))!.setAttribute(
    'content',
    rgbToHex(token[0], token[1], token[2]),
  );
};
