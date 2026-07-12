import { typefaceList, getTypeface, defaultTypeface } from '../ascii/fonts';
import { createSelect } from './select';
import { createCopyButton } from './copyButton';
import { createDownloadButton } from './downloadButton';

const inputClass =
  'w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-base text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40';

function template(): string {
  return `
    <div class="flex h-full flex-col gap-4">
      <section class="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <label class="flex flex-col gap-2">
          <span class="text-sm font-medium text-slate-300">Your text</span>
          <input id="ascii-input" class="${inputClass}" type="text" value="Hello, World!" placeholder="Type here" autocomplete="off" />
        </label>
        <div class="flex flex-col gap-2">
          <span class="text-sm font-medium text-slate-300">Font</span>
          <div id="ascii-font-mount" class="sm:w-48"></div>
        </div>
      </section>

      <section class="flex min-h-0 flex-1 flex-col gap-2">
        <div class="flex items-center justify-between gap-2">
          <span class="text-sm font-medium text-slate-300">Output</span>
          <div id="ascii-actions" class="flex gap-2"></div>
        </div>
        <textarea id="ascii-output" readonly class="min-h-0 w-full flex-1 resize-none overflow-auto whitespace-pre rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-xs leading-tight text-sky-300"></textarea>
      </section>
    </div>
  `;
}

export function mountTextPanel(root: HTMLElement): void {
  root.innerHTML = template();

  const input = root.querySelector<HTMLInputElement>('#ascii-input')!;
  const fontMount = root.querySelector<HTMLDivElement>('#ascii-font-mount')!;
  const actions = root.querySelector<HTMLDivElement>('#ascii-actions')!;
  const output = root.querySelector<HTMLTextAreaElement>('#ascii-output')!;

  const select = createSelect({
    name: 'font',
    options: typefaceList
      .map((typeface) => ({ value: typeface.name, label: typeface.label }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    value: defaultTypeface.name,
    onChange: () => update(),
  });
  fontMount.append(select.el);
  actions.append(
    createDownloadButton(() => output.value, 'ascii-text.txt'),
    createCopyButton(() => output.value)
  );

  function update(): void {
    output.value = getTypeface(select.getValue()).render(input.value);
  }

  input.addEventListener('input', update);
  update();
}
