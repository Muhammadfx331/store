/* عدّاد على أيقونة التطبيق (Badging API) لما يوصل إشعار والمتجر مسكّر. لازم يجي قبل importScripts */
self.addEventListener('push', function (e) {
  e.waitUntil((async function () {
    let n = 1;
    try {
      // نتجاهل بس إذا المتجر مفتوح وعليه التركيز فعلاً (iOS ممكن يخلّي نافذة مخفية تبين "visible")
      const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      if (wins.some(function (w) { return w.focused; })) return;
    } catch (err) {}
    try {
      const c = await caches.open('store-badge'), r = await c.match('n');
      n = (r ? parseInt(await r.text(), 10) || 0 : 0) + 1;
      await c.put('n', new Response(String(n)));
    } catch (err) {}
    try { if (self.navigator && self.navigator.setAppBadge) await self.navigator.setAppBadge(n); } catch (err) {}
  })());
});
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
