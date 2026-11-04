/* Liberato Fitness — Service Worker (Fase 2: Web Push).
   Recibe el push que dispara Supabase y muestra la notificación; en un iPhone
   con la app instalada, iOS la refleja automáticamente en el Apple Watch.
   No cachea nada (la app se auto-actualiza por version.json). */

self.addEventListener('push', function(event){
  var d = {};
  try { d = event.data ? event.data.json() : {}; }
  catch(e){ d = { title: 'Liberato Fitness', body: (event.data ? event.data.text() : '') }; }
  var title = d.title || 'Liberato Fitness';
  var opts = {
    body: d.body || '',
    tag: d.tag || 'liberato-fit',
    renotify: true,
    data: { url: d.url || '/liberato-fitness/' }
  };
  event.waitUntil(self.registration.showNotification(title, opts));
});

self.addEventListener('notificationclick', function(event){
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || '/liberato-fitness/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list){
      for (var i = 0; i < list.length; i++){ if ('focus' in list[i]) return list[i].focus(); }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});

self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(event){ event.waitUntil(self.clients.claim()); });
