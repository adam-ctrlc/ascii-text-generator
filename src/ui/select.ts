export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectConfig {
  name: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export interface SelectHandle {
  el: HTMLElement;
  getValue: () => string;
  setValue: (value: string) => void;
}

const selectClass =
  'w-full cursor-pointer appearance-none truncate rounded-lg border border-slate-700 bg-slate-900 py-3 pl-4 pr-10 text-base text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 [&>option]:bg-slate-900 [&>option]:text-slate-100';

const chevronClass =
  'fa-solid fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400';

export function createSelect(config: SelectConfig): SelectHandle {
  const container = document.createElement('div');
  container.className = ['relative', config.className].filter(Boolean).join(' ');

  const select = document.createElement('select');
  select.name = config.name;
  select.id = config.name;
  select.className = selectClass;

  for (const option of config.options) {
    const el = document.createElement('option');
    el.value = option.value;
    el.textContent = option.label;
    el.selected = option.value === config.value;
    select.append(el);
  }

  const chevron = document.createElement('i');
  chevron.className = chevronClass;

  container.append(select, chevron);
  select.addEventListener('change', () => config.onChange(select.value));

  return {
    el: container,
    getValue: () => select.value,
    setValue: (value) => {
      select.value = value;
    },
  };
}
