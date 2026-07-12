import figlet, { type FontName } from 'figlet';
import type { Typeface } from '../typeface';
import Standard from 'figlet/importable-fonts/Standard.js';
import Slant from 'figlet/importable-fonts/Slant.js';
import Big from 'figlet/importable-fonts/Big.js';
import AnsiShadow from 'figlet/importable-fonts/ANSI Shadow.js';

interface FigletSpec {
  name: string;
  label: string;
  font: FontName;
  data: string;
}

const specs: FigletSpec[] = [
  { name: 'standard', label: 'Standard', font: 'Standard', data: Standard },
  { name: 'slant', label: 'Slant', font: 'Slant', data: Slant },
  { name: 'big', label: 'Big', font: 'Big', data: Big },
  { name: 'ansi-shadow', label: 'ANSI Shadow', font: 'ANSI Shadow', data: AnsiShadow },
];

for (const spec of specs) {
  figlet.parseFont(spec.font, spec.data);
}

export const figletTypefaces: Typeface[] = specs.map((spec) => ({
  name: spec.name,
  label: spec.label,
  render: (text) => figlet.textSync(text, { font: spec.font }),
}));
