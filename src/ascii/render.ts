import type { Font, Glyph } from './types';

function glyphWidth(glyph: Glyph): number {
  return glyph.reduce((max, row) => Math.max(max, row.length), 0);
}

function padGlyph(glyph: Glyph, height: number): Glyph {
  const width = glyphWidth(glyph);
  const padded: Glyph = [];
  for (let row = 0; row < height; row++) {
    const line = glyph[row] ?? '';
    padded.push(line.padEnd(width, ' '));
  }
  return padded;
}

function resolveGlyph(char: string, font: Font): Glyph {
  const direct = font.glyphs[char];
  if (direct) return direct;

  const upper = font.glyphs[char.toUpperCase()];
  if (upper) return upper;

  return font.glyphs[font.fallback] ?? [''];
}

function renderLine(line: string, font: Font): string {
  const glyphs = Array.from(line).map((char) =>
    padGlyph(resolveGlyph(char, font), font.height)
  );

  const gap = ' '.repeat(font.letterSpacing);
  const rows: string[] = [];

  for (let row = 0; row < font.height; row++) {
    rows.push(glyphs.map((glyph) => glyph[row]).join(gap));
  }

  return rows.join('\n');
}

export function render(text: string, font: Font): string {
  const separator = '\n'.repeat(2);
  return text
    .split('\n')
    .map((line) => renderLine(line, font))
    .join(separator);
}
