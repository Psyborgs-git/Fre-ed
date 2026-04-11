export function getScrollableProgress(scrollTop, scrollHeight, clientHeight) {
  const maxScroll = Math.max(scrollHeight - clientHeight, 0);

  if (maxScroll === 0) {
    return 0;
  }

  return Math.min(1, Math.max(0, scrollTop / maxScroll));
}