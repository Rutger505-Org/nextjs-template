// Replaces Next's client polyfill-module (aliased in next.config.ts). Next ships it
// unconditionally, ignoring browserslist; everything in it is Baseline in Next's supported
// browsers (Chrome/Edge/Firefox 111+, Safari 16.4+) except URL.canParse (Safari 17+),
// which Next's client code uses, so keep that one.
if (!("canParse" in URL)) {
  URL.canParse = function (url, base) {
    try {
      new URL(url, base);
      return true;
    } catch {
      return false;
    }
  };
}
