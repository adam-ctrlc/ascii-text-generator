export function createDownloadButton(
  getText: () => string,
  filename: string
): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className =
    'inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 active:scale-95 sm:px-4';

  const icon = document.createElement('i');
  icon.className = 'fa-solid fa-download';
  const label = document.createElement('span');
  label.className = 'hidden sm:inline';
  label.textContent = 'Download .txt';
  button.append(icon, label);

  button.addEventListener('click', () => {
    const text = getText();
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  });

  return button;
}
