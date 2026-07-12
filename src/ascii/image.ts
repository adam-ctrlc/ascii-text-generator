export interface ImageAsciiOptions {
  columns: number;
  charset?: string;
  invert?: boolean;
}

const DEFAULT_RAMP = ' .:-=+*#%@';
const CHAR_ASPECT = 0.5;

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

export function imageToAscii(
  source: HTMLImageElement,
  options: ImageAsciiOptions
): string {
  const ramp = options.charset ?? DEFAULT_RAMP;
  const columns = Math.max(1, Math.floor(options.columns));
  const srcWidth = source.naturalWidth || source.width;
  const srcHeight = source.naturalHeight || source.height;
  if (!srcWidth || !srcHeight) return '';

  const rows = Math.max(1, Math.round(columns * (srcHeight / srcWidth) * CHAR_ASPECT));

  const canvas = document.createElement('canvas');
  canvas.width = columns;
  canvas.height = rows;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.drawImage(source, 0, 0, columns, rows);
  const { data } = ctx.getImageData(0, 0, columns, rows);
  const lastIndex = ramp.length - 1;

  const lines: string[] = [];
  for (let y = 0; y < rows; y++) {
    let line = '';
    for (let x = 0; x < columns; x++) {
      const offset = (y * columns + x) * 4;
      const alpha = data[offset + 3] / 255;
      const luminance =
        (0.299 * data[offset] + 0.587 * data[offset + 1] + 0.114 * data[offset + 2]) *
        alpha;
      const level = luminance / 255;
      const ratio = options.invert ? level : 1 - level;
      line += ramp[Math.round(ratio * lastIndex)];
    }
    lines.push(line);
  }

  return lines.join('\n');
}
