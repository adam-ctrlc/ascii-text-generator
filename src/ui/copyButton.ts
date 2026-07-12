import { copyText } from './clipboard';

type CopyState = 'idle' | 'copied' | 'empty' | 'error';

function copyLabel(state: CopyState): string {
  switch (state) {
    case 'copied':
      return 'Copied!';
    case 'empty':
      return 'Nothing to copy';
    case 'error':
      return 'Copy failed';
    default:
      return 'Copy output';
  }
}

function copyIcon(state: CopyState): string {
  switch (state) {
    case 'copied':
      return 'fa-solid fa-check';
    case 'empty':
    case 'error':
      return 'fa-solid fa-triangle-exclamation';
    default:
      return 'fa-regular fa-copy';
  }
}

export function createCopyButton(getText: () => string): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className =
    'inline-flex w-auto items-center justify-center gap-2 rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-500 active:scale-95 sm:w-44 sm:px-4';

  const icon = document.createElement('i');
  const label = document.createElement('span');
  label.className = 'hidden sm:inline';
  button.append(icon, label);

  let resetTimer: ReturnType<typeof setTimeout> | undefined;

  function setState(state: CopyState): void {
    icon.className = copyIcon(state);
    label.textContent = copyLabel(state);
    if (resetTimer) clearTimeout(resetTimer);
    if (state !== 'idle') {
      resetTimer = setTimeout(() => setState('idle'), 1500);
    }
  }

  button.addEventListener('click', async () => {
    const text = getText();
    const ok = await copyText(text);
    setState(ok ? 'copied' : text ? 'error' : 'empty');
  });

  setState('idle');
  return button;
}
