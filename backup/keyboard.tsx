import * as React from 'react';

import { Input } from '~/components/ui/input';
import { useKeyboard } from '~/lib/keyboard';

function Example() {
  const { isKeyboardVisible, keyboardHeight, dismissKeyboard } = useKeyboard();

  console.log({ isKeyboardVisible, keyboardHeight });

  function onChangeText(text: string) {
    console.log('text', text);
    if (text === 'dismiss') {
      dismissKeyboard();
    }
  }

  return <Input onChangeText={onChangeText} />;
}
