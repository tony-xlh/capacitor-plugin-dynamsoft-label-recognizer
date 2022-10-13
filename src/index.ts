import { registerPlugin } from '@capacitor/core';

import type { LabelRecognizerPlugin } from './definitions';

const LabelRecognizer = registerPlugin<LabelRecognizerPlugin>('LabelRecognizer', {
  web: () => import('./web').then(m => new m.LabelRecognizerWeb()),
});

export * from './definitions';
export { LabelRecognizer };
