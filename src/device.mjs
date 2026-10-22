// Native payment capability follows device type, never window size or orientation.
// Browser widths simulate the phone/tablet experiences for development only.
export function supportsCheckout(platform, isPad, width) {
  return platform === 'ios' ? isPad === true : platform === 'web' && width >= 900;
}
