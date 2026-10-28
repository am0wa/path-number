import '@testing-library/jest-dom/vitest';

// jsdom has no AnimationEvent, so React would listen for "webkitAnimationEnd" instead of "animationend";
// define it before react-dom loads, as browsers do, so fireEvent.animationEnd reaches onAnimationEnd
if (!('AnimationEvent' in window)) {
  Object.defineProperty(window, 'AnimationEvent', { value: class AnimationEvent extends Event {} });
}
