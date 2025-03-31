//1.Definir los archivos que van a estar en la memoria cache del navegador

const CACHE_NAME = 'cache_store';
const FILES =[
    './index.html',
    './pages/sostenibilidad.html',
    './pages/quienes-somos.html',
    './pages/nuestras-cervezas.html',
    './pages/maridajes.html',
    './pages/contacto.html',
    './css/styles.css',
    './dist/accesibilidad.js',
    './dist/app.js',
    'dist/CRUD.js',
    './dist/inicio.js',
    './dist/verificacionEdad.js',
    './assets/img',
    './assets/videos',
    './assets/img/acai_fruta.png',
    './assets/img/acaiBotella.jpeg',
    './assets/img/acaiLata.jpeg',
    './assets/img/agricultores1.png',
    './assets/img/agricultor.png',
    './assets/img/arazaBotella.jpeg',
    './assets/img/arazaLata.jpeg',
    './assets/img/brochetas_maridaje.png',
    './assets/img/cerveza_sostenibilidad.png',
    './assets/img/cervezaaaaaaaaa.png',
    './assets/img/cervezas_playa.png',
    './assets/img/cervezasTodas.jpg',
    './assets/img/ceviche_maridaje.png',
    './assets/img/collage.png',
    './assets/img/comida_maridajes.jpg',
    './assets/img/fondo_contacto.jpg',
    './assets/img/esquina1.png',
    './assets/img/esquina2.png',
    './assets/img/Hamburguer_acai.png',
    './assets/img/hamburguesa_frutos rojos.png',
    './assets/img/helado_maridaje.png',
    './assets/img/inicio_nindos.jpg',
    './assets/img/logo.png',
    './assets/img/logo2.png',
    './assets/img/logo2_128.png',
    './assets/img/logo2_180.png',
    './assets/img/logo2_192.png',
    './assets/img/logo2_256.png',
    './assets/img/logo2_512.png',
    './assets/img/maridaje_costillas.png',
    './assets/img/mezclaBotella.jpeg',
    './assets/img/mezclaLata.jpeg',
    './assets/img/nosotros_nindos.jpg',
    './assets/img/paneles.png',
    './assets/img/postrecito_maridale.png',
    './assets/img/postrecito_maridale.png',
    './assets/img/yaka_agua.png',
    './assets/img/selva.png',
    './assets/img/yaka_corales.png',
]

/*
¿que va haer el metodo self?
1. verificar que los archivos existen antes de guardarlos en cache
amacenar en cache solo los archivos validos 
Activar el SW 
*/
self.addEventListener('install', (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            console.log('verificando archivos antes de empezar');
            const validFiles =(
                await Promise.all(FILES.map(async (file) => {
                    try {
                        const response = await fetch(file, { method: 'HEAD' });
                        if (response.ok){
                            console.log(`Archivo encontrado ${file}`);
                            return file;
                        }else{
                            console.warn(`Archivo no encontrado ${file} (Status: ${response.status})`);
                        }
                        
                    } catch (error) {
                        console.error(`Error al verificar el archivo ${file} (Status: ${response.status})`);
                    }
                    return null;
                }))).filter(Boolean);
                await cache.addAll(validFiles);
                console.log('Archivos almacenados en cache:');
                self.skipWaiting();   // permite que el SW active inmediatamente         
        }
    )()
    );
});

/* Que hace?
 1. intercepta todas las peticines de fetch
 2. si el recurso esta en la red 
 3. si la red esta en cache, lo descarga de la red 
 4. si falla devuelve eroor 503
 */

 self.addEventListener('fetch', (event) => {
    console.log(`Interceptando la peticion: ${event.request.url}`);
    event.responWith(
        caches.match(event.request).then((cachedResponse)=>{
            if(cachedResponse){
                return cachedResponse;
            }
            return fetch(event.request)
                .then((networkResponse)=>{
                    return networkResponse;
                })
                .catch((error)=>{
                    return new Response ('No hay conexion y el recurso no esta en cache',{status: 503, statusText: 'Servicio no disponible:'+error.message});

                });
        }

        )
    );
 });

 /*
 Busca y elimina versiones antiguas de cache.
 Usa self.clients.claim() para que el SW controle inmediatamente todas las pestañas abiertas.
 */

 self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async ()=> {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME)
                .map(name => caches.delete(name)));
                console.log('caches antiguas eliminadas')
        })
    );
    self.clients.claim();
 });
