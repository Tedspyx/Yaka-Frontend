//Service Worker
if ('serviceWorker' in navigator) {
    console.log('Service Worker is available');
  
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('./service_worker.js').then(
        function(registration) {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(function(err) {
          console.log('ServiceWorker registration failed: ', err);
        });
    });
  }
   