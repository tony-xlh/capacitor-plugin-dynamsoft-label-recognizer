import { WebPlugin } from '@capacitor/core';

import type { LabelRecognizerPlugin } from './definitions';

export class LabelRecognizerWeb extends WebPlugin implements LabelRecognizerPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
