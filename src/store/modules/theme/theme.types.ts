export type Token = [number, number, number, number];

export interface Theme {
    background: Token,
    level1: Token,
    level2: Token,
    level3: Token,
    foreground: Token,
    highlight: Token,
};

export interface ThemePair {
    dark: Theme,
    light: Theme,
};
