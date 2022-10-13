export interface LabelRecognizerPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
