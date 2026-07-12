export interface Ramp {
  name: string;
  label: string;
  chars: string;
}

export const ramps: Ramp[] = [
  { name: 'standard', label: 'Standard', chars: ' .:-=+*#%@' },
  {
    name: 'detailed',
    label: 'Detailed',
    chars: ' .\'`^",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
  },
  { name: 'blocks', label: 'Blocks', chars: ' ░▒▓█' },
  { name: 'minimal', label: 'Minimal', chars: ' .:-=#' },
];

export const defaultRamp: Ramp = ramps[0];

export function getRamp(name: string): Ramp {
  return ramps.find((ramp) => ramp.name === name) ?? defaultRamp;
}
