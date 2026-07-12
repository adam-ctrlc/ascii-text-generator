import { getTypeface } from '../ascii/fonts';
import { mountTextPanel } from './textPanel';
import { mountImagePanel } from './imagePanel';

type TabName = 'text' | 'image';

const tabBase = 'rounded-lg px-4 py-2 text-sm font-semibold transition';
const tabActive = 'bg-sky-600 text-white';
const tabIdle = 'bg-slate-900 text-slate-300 hover:bg-slate-800';

function template(): string {
  return `
    <main class="mx-auto flex h-[100dvh] max-w-5xl flex-col gap-3 px-4 py-4 sm:gap-4 sm:py-6">
      <header class="flex min-w-0 flex-col gap-1">
        <div class="flex min-w-0 flex-col gap-1 sm:hidden">
          <pre id="app-title-mobile" aria-hidden="true" class="min-w-0 max-w-full overflow-x-auto overflow-y-hidden font-mono text-[10px] leading-none text-sky-400"></pre>
          <p class="text-2xl font-bold tracking-tight text-slate-100">Text Generator</p>
        </div>
        <pre id="app-title" aria-label="ASCII Text Generator" class="hidden min-w-0 max-w-full overflow-x-auto overflow-y-hidden font-mono text-xs leading-none text-sky-400 sm:block"></pre>
        <p class="text-sm text-slate-400">Turn text or an image into copy-paste ASCII art.</p>
      </header>

      <nav class="flex gap-2">
        <button type="button" data-tab="text" class="${tabBase}">
          <i class="fa-solid fa-font"></i> Text
        </button>
        <button type="button" data-tab="image" class="${tabBase}">
          <i class="fa-solid fa-image"></i> Image
        </button>
      </nav>

      <div id="panel-text" class="min-h-0 flex-1"></div>
      <div id="panel-image" class="hidden min-h-0 flex-1"></div>
    </main>
  `;
}

export function mountApp(root: HTMLElement): void {
  root.innerHTML = template();

  const titleDesktop = root.querySelector<HTMLPreElement>('#app-title')!;
  const titleMobile = root.querySelector<HTMLPreElement>('#app-title-mobile')!;
  const textPanel = root.querySelector<HTMLDivElement>('#panel-text')!;
  const imagePanel = root.querySelector<HTMLDivElement>('#panel-image')!;
  const tabButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-tab]'));

  const shadow = getTypeface('ansi-shadow');
  titleMobile.textContent = shadow.render('ASCII');
  titleDesktop.textContent = `${shadow.render('ASCII')}\n${shadow.render('TEXT GENERATOR')}`;

  mountTextPanel(textPanel);
  mountImagePanel(imagePanel);

  function setTab(tab: TabName): void {
    textPanel.classList.toggle('hidden', tab !== 'text');
    imagePanel.classList.toggle('hidden', tab !== 'image');
    for (const button of tabButtons) {
      const active = button.dataset.tab === tab;
      button.className = `${tabBase} ${active ? tabActive : tabIdle}`;
    }
  }

  for (const button of tabButtons) {
    button.addEventListener('click', () => {
      switch (button.dataset.tab) {
        case 'image':
          setTab('image');
          break;
        default:
          setTab('text');
          break;
      }
    });
  }

  setTab('text');
}
