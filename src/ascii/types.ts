export type Glyph = string[];

export interface Font {
  name: string;
  label: string;
  height: number;
  letterSpacing: number;
  fallback: string;
  glyphs: Record<string, Glyph>;
}
