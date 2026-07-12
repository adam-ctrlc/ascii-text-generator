import type { Typeface } from '../typeface';
import { render } from '../render';
import { block } from './block';
import { figletTypefaces } from './figlet';

const blockTypeface: Typeface = {
  name: block.name,
  label: block.label,
  render: (text) => render(text, block),
};

export const typefaceList: Typeface[] = [blockTypeface, ...figletTypefaces];

const typefaces: Record<string, Typeface> = Object.fromEntries(
  typefaceList.map((typeface) => [typeface.name, typeface])
);

export const defaultTypeface: Typeface = typefaces['ansi-shadow'] ?? blockTypeface;

export function getTypeface(name: string): Typeface {
  return typefaces[name] ?? defaultTypeface;
}
