import { imageToAscii, loadImage } from '../ascii/image';
import { ramps, defaultRamp, getRamp } from '../ascii/ramps';
import { createSelect } from './select';
import { createCopyButton } from './copyButton';
import { createDownloadButton } from './downloadButton';

const dropBase =
  'flex cursor-pointer items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-700 bg-slate-900 px-4 py-4 text-sm text-slate-300 transition hover:border-slate-500';

function template(): string {
  return `
    <div class="flex h-full flex-col gap-4">
      <label id="img-drop" class="${dropBase}">
        <i class="fa-solid fa-image text-slate-400"></i>
        <span id="img-drop-label">Drop an image here, or click to browse</span>
        <input id="img-file" type="file" accept="image/*" class="hidden" />
      </label>

      <section class="grid items-end gap-4 sm:grid-cols-[1fr_1fr_auto]">
        <div class="flex flex-col gap-2">
          <span class="text-sm font-medium text-slate-300">Detail</span>
          <div id="img-ramp-mount"></div>
        </div>
        <label class="flex flex-col gap-2">
          <span class="text-sm font-medium text-slate-300">Width: <span id="img-width-value">100</span> chars</span>
          <input id="img-width" type="range" min="30" max="220" step="1" value="100" class="w-full accent-sky-500" />
        </label>
        <label class="flex select-none items-center gap-2 pb-2">
          <input id="img-invert" type="checkbox" class="h-4 w-4 accent-sky-500" />
          <span class="text-sm font-medium text-slate-300">Invert</span>
        </label>
      </section>

      <section class="flex min-h-0 flex-1 flex-col gap-2">
        <div class="flex items-center justify-between gap-2">
          <span class="text-sm font-medium text-slate-300">Output</span>
          <div id="img-actions" class="flex gap-2"></div>
        </div>
        <textarea id="img-output" readonly placeholder="Upload an image to see the ASCII art." class="min-h-0 w-full flex-1 resize-none overflow-auto whitespace-pre rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-[6px] leading-none text-sky-300 placeholder:text-sm placeholder:leading-normal placeholder:text-slate-500"></textarea>
      </section>
    </div>
  `;
}

export function mountImagePanel(root: HTMLElement): void {
  root.innerHTML = template();

  const drop = root.querySelector<HTMLLabelElement>('#img-drop')!;
  const dropLabel = root.querySelector<HTMLSpanElement>('#img-drop-label')!;
  const fileInput = root.querySelector<HTMLInputElement>('#img-file')!;
  const rampMount = root.querySelector<HTMLDivElement>('#img-ramp-mount')!;
  const width = root.querySelector<HTMLInputElement>('#img-width')!;
  const widthValue = root.querySelector<HTMLSpanElement>('#img-width-value')!;
  const invert = root.querySelector<HTMLInputElement>('#img-invert')!;
  const actions = root.querySelector<HTMLDivElement>('#img-actions')!;
  const output = root.querySelector<HTMLTextAreaElement>('#img-output')!;

  const rampSelect = createSelect({
    name: 'ramp',
    options: ramps.map((ramp) => ({ value: ramp.name, label: ramp.label })),
    value: defaultRamp.name,
    onChange: () => render(),
  });
  rampMount.append(rampSelect.el);
  actions.append(
    createDownloadButton(() => output.value, 'ascii-image.txt'),
    createCopyButton(() => output.value)
  );

  let image: HTMLImageElement | undefined;
  let objectUrl: string | undefined;

  function render(): void {
    if (!image) return;
    output.value = imageToAscii(image, {
      columns: Number(width.value),
      charset: getRamp(rampSelect.getValue()).chars,
      invert: invert.checked,
    });
  }

  async function handleFile(file: File): Promise<void> {
    if (!file.type.startsWith('image/')) return;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(file);
    dropLabel.textContent = file.name;
    try {
      image = await loadImage(objectUrl);
      render();
    } catch {
      output.value = 'Could not read that image.';
    }
  }

  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (file) handleFile(file);
  });

  drop.addEventListener('dragover', (event) => {
    event.preventDefault();
    drop.classList.add('border-sky-500');
  });
  drop.addEventListener('dragleave', () => drop.classList.remove('border-sky-500'));
  drop.addEventListener('drop', (event) => {
    event.preventDefault();
    drop.classList.remove('border-sky-500');
    const file = event.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  });

  width.addEventListener('input', () => {
    widthValue.textContent = width.value;
    render();
  });
  invert.addEventListener('change', render);
}
