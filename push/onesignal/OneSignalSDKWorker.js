/* عدّاد على أيقونة التطبيق (Badging API) لما يوصل إشعار والمتجر مسكّر. لازم يجي قبل importScripts */
self.addEventListener('push', function (e) {
  e.waitUntil((async function () {
    try {
      const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      if (wins.some(function (w) { return w.visibilityState === 'visible'; })) return; // المتجر مفتوح قدام الزبون: ما في داعي
      const c = await caches.open('store-badge'), r = await c.match('n');
      const n = (r ? parseInt(await r.text(), 10) || 0 : 0) + 1;
      await c.put('n', new Response(String(n)));
      if (self.navigator && navigator.setAppBadge) await navigator.setAppBadge(n);
    } catch (err) {}
  })());
});
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
