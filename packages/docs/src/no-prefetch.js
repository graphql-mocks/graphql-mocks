// UGLY HACK:
// The prefetch functionality of docusaurus is failing and creating console errors.
// Comment out this line to see the issue. The prefetch attempts to use some internal
// webpack function that does not exist ("__webpack_require__.u is not a function" when on local dev)
// The error exists in production builds as well. Since the `prefetch` is more of an optmiziation
// and the website functions without it this will noop the functions, and `preload` also
export function onRouteUpdate() {
  // eslint-disable-next-line no-undef
  if (window) {
    // eslint-disable-next-line no-undef
    window.docusaurus = { prefetch: () => {}, preload: () => {} };
  }
}
