// GitHub may update the query string through an internal navigation mechanism
// that does not emit a webNavigation event. Report the initial URL and every
// later change so the service worker can reapply the saved preferences.
let previousUrl = "";

function reportCurrentUrl() {
  const currentUrl = window.location.href;

  if (currentUrl === previousUrl) {
    return;
  }

  previousUrl = currentUrl;
  chrome.runtime.sendMessage({ type: "github-url-changed", url: currentUrl });
}

reportCurrentUrl();
window.addEventListener("popstate", reportCurrentUrl);
window.addEventListener("hashchange", reportCurrentUrl);
document.addEventListener("turbo:load", reportCurrentUrl);

// A small fallback for GitHub's client-side router, which can change the URL
// without firing a browser navigation or a public Turbo event.
setInterval(reportCurrentUrl, 250);
