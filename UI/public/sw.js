/// <reference no-default-lib="false"/>
/// <reference lib="ES2015" />
/// <reference lib="webworker" />

;(() => {
  // This is a little messy, but necessary to force type assertion
  // Same issue as in TS -> https://github.com/microsoft/TypeScript/issues/14877
  // prettier-ignore
  const self = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (globalThis.self));

  self.addEventListener('install', () => {
    console.log('service worker: installed')
  })

  self.addEventListener('push', (event) => {
    const data = event.data.json()
    self.registration.showNotification(data.title, {
      body: data.name
    })
  })
})()
