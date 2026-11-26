// The existing blog homepage (not the game) has three optional external theme resources.
// Observe genuine Chromium traffic, without intercepting or fulfilling anything. Vue reports
// a remote fetch failure from runtime-core on localhost, so the console's source URL alone
// cannot distinguish it from a broken local asset. Require an exact initiator or Event target.
const widgets = new Set(['https://bing-wallpaper.vuejs.press/api/wallpaper', 'https://v1.hitokoto.cn/',
  'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/js/all.min.js']);
export async function watchHomeRequests(page, home, failures) {
  const session = await page.context().newCDPSession(page), requests = new Map();
  session.on('Network.requestWillBeSent', e => {
    if (e.documentURL !== home || !widgets.has(e.request.url)) return;
    const caller = e.initiator?.stack?.callFrames?.[0];
    requests.set(e.requestId, { url: e.request.url, caller: caller ? `${caller.url}:${caller.lineNumber + 1}:${caller.columnNumber + 1}` : null });
  });
  session.on('Network.loadingFailed', e => {
    const request = requests.get(e.requestId);
    if (request) failures.push({ ...request, reason: e.errorText });
  });
  await session.send('Network.enable');
}
export function separateHomeWarnings(issues, failures) {
  const local = [], external = [];
  for (const issue of issues) {
    const firstFrame = issue.text.split('\n')[1] ?? '';
    const match = failures.find(f => (issue.resource && f.url === issue.resource) ||
      (issue.text.includes('TypeError: Failed to fetch') && f.caller && firstFrame.includes(f.caller)));
    if (match) external.push({ url: match.url, reason: match.reason, error: issue.text.split('\n')[0], caller: match.caller });
    else local.push(issue.text);
  }
  return { local, external };
}
