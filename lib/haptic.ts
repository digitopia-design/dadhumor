export const haptic = {
  supported: typeof navigator !== 'undefined' && 'vibrate' in navigator,
  light()      { if (this.supported) navigator.vibrate(10); },
  medium()     { if (this.supported) navigator.vibrate(20); },
  heavy()      { if (this.supported) navigator.vibrate(40); },
  double()     { if (this.supported) navigator.vibrate([15, 50, 15]); },
  groanBuild() { if (this.supported) navigator.vibrate([30, 60, 50, 40, 80, 30, 120]); },
  groanHit()   { if (this.supported) navigator.vibrate([180, 40, 60]); },
  stop()       { if (this.supported) navigator.vibrate(0); },
};
