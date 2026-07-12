export interface Typeface {
  name: string;
  label: string;
  render(text: string): string;
}
