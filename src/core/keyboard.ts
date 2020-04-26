/**
* Representaton values of the KeyboardEvent Keys
* @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
*/
export enum KeyboardKey {

  // ------------------------------------------
  // Special values
  // ------------------------------------------
  /**
   * The user agent wasn't able to map the event's virtual keycode to a specific key value.
   * Relevant on mobile.
   */
  Unidentified = 'Unidentified',

  // ------------------------------------------
  // Modifier keys
  // ------------------------------------------
  CapsLock = 'CapsLock',
  Alt = 'Alt',
  Control = 'Control',
  Fn = 'Fn',
  Shift = 'Shift',

  // ------------------------------------------
  // Whitespace keys
  // ------------------------------------------
  Enter = 'Enter',
  Tab = 'Tab',
  SpaceBar = ' ',

  // ------------------------------------------
  // Editing keys
  // ------------------------------------------
  Backspace = 'Backspace',
  Delete = 'Delete',
}

export enum KeyboardKeyCode {
  // ------------------------------------------
  // Whitespace keys
  // ------------------------------------------
  Enter = 13,
  Tab = 9,
  SpaceBar = 32,
  // ------------------------------------------
  // Editing keys
  // ------------------------------------------
  Backspace = 8,
  Delete = 46,
  // Special mobile keys
  /**
   * happens on mobile as Preceding Placeholder key for special char
   * or just for all keys which wasn't mapped (e.g. Backspace, Space, etc.)
   */
  Unidentified = 229,
}
