export function sendMetaPageView() {
  if (typeof window === "undefined") return;
  const eventId = `pageview_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  void fetch("/api/meta-capi", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      event_name: "PageView",
      event_id: eventId,
      url: window.location.href,
    }),
    keepalive: true,
  }).catch(() => undefined);
}
