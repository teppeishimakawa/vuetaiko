
const CACHE_NAME = 'v111';
const urlsToCache = [
    '../src/assets/ashiato.png',
    '../src/assets/born.png',
    '../src/assets/bow.png',
    '../src/assets/bug.png',
    '../src/assets/cat.png',
    '../src/assets/chou.png',
    '../src/assets/dog.png',
    '../src/assets/dolphin2.png',
    '../src/assets/dolphin.png',
    '../src/assets/fish.png',
    '../src/assets/fish2.png',
    '../src/assets/fish3.png',
    '../src/assets/fish4.png',
    '../src/assets/frog.png',
    '../src/assets/gachou.png',
    '../src/assets/heart.png',
    '../src/assets/horse.png',
    '../src/assets/house.png',
    '../src/assets/kame.png',
    '../src/assets/maru.png',
    '../src/assets/medic.png',
    '../src/assets/panda.png',
    '../src/assets/pen.png',
    '../src/assets/sai.png',
    '../src/assets/tanba.png',
    '../src/assets/tori.png',
    '../src/assets/tori2.png',
    '../src/assets/tori3.png',
    '../src/assets/uma.png',
    '../src/assets/zebla.png',
    '../src/assets/zou.png'
  ]

self.addEventListener('install', function(event)
{
//プログラム修正した新しいService Workerの制御を即座に開始
  //  event.waitUntil(self.skipWaiting());
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => {
  console.log("cache.addAll ok")
  return cache.addAll(urlsToCache.map(url => new Request(url, {credentials: 'same-origin'})));
}));
  console.log('インストール');
});

//install完了するとactivateになる
self.addEventListener('activate', (event) => {
//初回から強制的にService Workerの制御を開始
  event.waitUntil(self.clients.claim());
  console.info('activate', event);
});


self.addEventListener('fetch', function(event) {
  console.log('fetch', event.request.url);

  event.respondWith(
    // リクエストに一致するデータがキャッシュにあるかどうか
    caches.match(event.request).then(function(cacheResponse) {
      // キャッシュがあればそれを返す、なければリクエストを投げる
      return cacheResponse || fetch(event.request).then(function(response) {
        return caches.open(CACHE_NAME).then(function(cache) {
          // レスポンスをクローンしてキャッシュに入れる
          cache.put(event.request, response.clone());
          // オリジナルのレスポンスはそのまま返す
          return response;
        });
      });
    })
  );
});