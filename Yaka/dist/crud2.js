document.addEventListener('DOMContentLoaded', function () {
    // Variables de modales y botones de login/registro
    const loginModal = document.getElementById("login-modal");
    const loginBtn = document.getElementById("login-btn");
    const closeLoginBtn = document.getElementsByClassName("close")[0];
    const registerLink = document.querySelector(".register-link a");
    const registerModal = document.getElementById('register-modal');
    const closeRegisterBtn = document.querySelector('.close-register');
    const loginLink = document.getElementById('login-link');
  
    // Abrir modal de login al hacer clic en “Iniciar Sesión”
    if (loginBtn) {
      loginBtn.onclick = () => {
        loginModal.style.display = "block";
      };
    }
  
    // Abrir modal de registro desde login
    if (registerLink) {
      registerLink.onclick = (e) => {
        e.preventDefault();
        loginModal.style.display = "none";
        registerModal.style.display = "block";
      };
    }
  
    // Abrir modal de login desde registro
    if (loginLink) {
      loginLink.onclick = (e) => {
        e.preventDefault();
        registerModal.style.display = "none";
        loginModal.style.display = "block";
      };
    }
  
    // Cerrar modales con el botón "X"
    if (closeLoginBtn) {
      closeLoginBtn.addEventListener('click', function () {
        loginModal.style.display = 'none';
      });
    }
    if (closeRegisterBtn) {
      closeRegisterBtn.addEventListener('click', function () {
        registerModal.style.display = 'none';
      });
    }
  
    // Cerrar modales al hacer clic fuera
    window.onclick = (e) => {
      if (e.target === loginModal || e.target === registerModal) {
        if (loginModal) loginModal.style.display = "none";
        if (registerModal) registerModal.style.display = "none";
      }
    };
  
    // Verificar si hay usuario logueado
    userLogged();
  
    // Función de login
    function loginForm(e) {
      e.preventDefault();
  
      // Obtener valores de inputs
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      // Validar campos vacíos
      if (!email || !password) {
        alert('Por favor, complete todos los campos');
        return;
      }
  
      // Llamada a la API para obtener el usuario por email
      fetch('http://localhost:8080/usuario/getUsuarioByEmail/' + encodeURIComponent(email), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (!response.ok) {
            alert('Usuario no encontrado');
          }
          return response.json();
        })
        .then(user => {
          if (user && user.password === password) {
            // Login exitoso: guardar datos en sessionStorage
            sessionStorage.setItem('dataUser', JSON.stringify({
              id: user.id,
              nombre: user.nombre,
              apellido: user.apellido,
              email: user.email,
              edad: user.edad,
              role: user.role
            }));
  
            // Cerrar modal y actualizar interfaz
            loginModal.style.display = 'none';
            updateUIForUserLog();
            alert(`Bienvenid@ ${user.nombre}!`);
          } else {
            alert('Usuario o contraseña incorrectos');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Error en el login: ' + error.message);
        });
    }
  
    // Asociar evento submit al formulario de login
    const formLogin = document.querySelector('.login-container form');
    if (formLogin) {
      formLogin.addEventListener('submit', loginForm);
    }
  
    // Registro en la base de datos
    const registerForm = document.querySelector('.register-container form');
    if (registerForm) {
      registerForm.addEventListener('submit', function (event) {
        event.preventDefault();
  
        // Obtener valores de inputs
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const email = document.getElementById('reg-email').value;
        const edad = document.getElementById('edad').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
  
        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
          alert('Las contraseñas no coinciden');
          return;
        }
  
        // Objeto para enviar a la API
        const usuario = {
          nombre: nombre,
          apellido: apellido,
          email: email,
          edad: parseInt(edad),
          password: password
        };
  
        // Llamada a la API para registrar el usuario
        fetch('http://localhost:8080/usuario/addUsuario', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(usuario)
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Error en el registro');
            }
            return response.json();
          })
          .then(data => {
            alert('Registro exitoso');
            registerForm.reset();
            registerModal.style.display = 'none';
            loginModal.style.display = 'block';
          })
          .catch(error => {
            console.error('Error:', error);
            alert('Error en el registro: ' + error.message);
          });
      });
    }
  
    // Función para verificar si hay un usuario logueado y actualizar la UI
    function userLogged() {
      const dataUser = sessionStorage.getItem('dataUser');
      if (dataUser) {
        updateUIForUserLog();
      } else {
        UIForInvitado();
      }
    }
  
    // Actualizar interfaz para usuario logueado
    function updateUIForUserLog() {
      const dataUser = JSON.parse(sessionStorage.getItem('dataUser'));
      if (dataUser) {
        const navBar = document.querySelector('nav.navigation ul');
        if (!navBar) return;
  
        const navItem = navBar.querySelector('li:last-child');
        if (navItem) {
          navItem.innerHTML = `
            <div class="perfil">
              <button class="perfil-btn">${dataUser.nombre} ▼</button>
              <div class="perfil-contenido">
                <li><a href="#" id="ver-perfil">Mi Perfil</a></li>
                <li><a href="#" id="ver-orden">Mis Pedidos</a></li>
                <li><a href="#" id="logout-btn">Cerrar Sesión</a></li>
              </div>
            </div>
          `;
  
          // Añadir botón para el carrito
          const cartLi = document.createElement('li');
          cartLi.innerHTML = `
            <a href="#" id="cart-btn" class="cart-button">🛒 <span class="cart-count">0</span></a>
          `;
          navBar.appendChild(cartLi);
  
          // Evento para desplegar el menú del perfil
          const btnPerfil = navBar.querySelector('.perfil-btn');
          const perfilContenido = navBar.querySelector('.perfil-contenido');
          btnPerfil.addEventListener('click', function (e) {
            e.stopPropagation();
            perfilContenido.style.display = perfilContenido.style.display === "block" ? "none" : "block";
          });
  
          // Cerrar menú si se clickea fuera
          document.addEventListener('click', (e) => {
            if (!btnPerfil.contains(e.target) && !perfilContenido.contains(e.target)) {
              perfilContenido.style.display = "none";
            }
          });
  
          // Eventos para las opciones del perfil
          const verPerfil = document.getElementById('ver-perfil');
          if (verPerfil) {
            verPerfil.addEventListener('click', mostrarPerfil);
          }
          const verOrden = document.getElementById('ver-orden');
          if (verOrden) {
            verOrden.addEventListener('click', (e) => {
              e.preventDefault();
              alert('Funcionalidad en trabajo...');
            });
          }
          const logoutBtn = document.getElementById('logout-btn');
          if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
              e.preventDefault();
              sessionStorage.removeItem('dataUser');
              sessionStorage.removeItem('cart');
              location.reload();
            });
          }
          const cartBtn = document.getElementById('cart-btn');
          if (cartBtn) {
            cartBtn.addEventListener('click', showCartModal);
          }
  
          // Actualizar contador del carrito
          updateCartCount();
        }
      }
    }
  
    // Interfaz para invitado
    function UIForInvitado() {
      const navBar = document.querySelector('nav.navigation ul');
      if (!navBar) return;
  
      // Eliminar botón de carrito si existe
      const cartBtn = document.getElementById('cart-btn');
      if (cartBtn && cartBtn.parentNode) {
        cartBtn.parentNode.remove();
      }
  
      // Mostrar botón de iniciar sesión
      const perfilLi = navBar.querySelector('li:last-child');
      if (perfilLi) {
        if (perfilLi.querySelector('.perfil')) {
          perfilLi.innerHTML = `<button id="login-btn" class="login-button">Iniciar Sesión</button>`;
          const newLoginBtn = document.getElementById('login-btn');
          if (newLoginBtn && loginModal) {
            newLoginBtn.addEventListener('click', () => {
              loginModal.style.display = 'block';
            });
          }
        }
      }
    }
  
    // Función para mostrar el perfil del usuario
    function mostrarPerfil(e) {
      if (e) e.preventDefault();
  
      const dataUser = JSON.parse(sessionStorage.getItem('dataUser'));
      if (!dataUser) {
        alert('No hay usuario logueado');
        return;
      }
  
      let profileModal = document.getElementById('profile-modal');
      if (!profileModal) {
        profileModal = document.createElement('div');
        profileModal.id = 'profile-modal';
        profileModal.className = 'modal';
  
        profileModal.innerHTML = `
          <div class="modal-content">
            <span class="close">&times;</span>
            <div class="profile-container">
              <h1>Mi Perfil</h1>
              <div class="user-info">
                <p><strong>Nombre:</strong> <span id="profile-name"></span></p>
                <p><strong>Apellido:</strong> <span id="profile-lastname"></span></p>
                <p><strong>Email:</strong> <span id="profile-email"></span></p>
                <p><strong>Tipo de usuario:</strong> <span id="profile-type"></span></p>
              </div>
              <button id="edit-profile-btn" class="btn">Editar Perfil</button>
            </div>
          </div>
        `;
        document.body.appendChild(profileModal);
  
        // Cerrar modal al hacer clic en la "X"
        profileModal.querySelector('.close').addEventListener('click', () => {
          profileModal.style.display = 'none';
        });
        // Cerrar al hacer clic fuera
        window.addEventListener('click', (e) => {
          if (e.target === profileModal) {
            profileModal.style.display = 'none';
          }
        });
        // Evento para editar perfil (funcionalidad en desarrollo)
        const editProfileBtn = document.getElementById('edit-profile-btn');
        if (editProfileBtn) {
          editProfileBtn.addEventListener('click', () => {
            alert('Funcionalidad de edición de perfil en desarrollo');
          });
        }
      }
  
      // Asignar datos al perfil
      document.getElementById('profile-name').textContent = dataUser.nombre || '';
      document.getElementById('profile-lastname').textContent = dataUser.apellido || '';
      document.getElementById('profile-email').textContent = dataUser.email || '';
      document.getElementById('profile-type').textContent = dataUser.role || '';
  
      profileModal.style.display = 'block';
    }
  
 // --- CONTROLES DE PRODUCTOS (EN "nuestras-cervezas.html") ---
function setupProductQuantityControls() {
        if (window.location.href.includes('nuestras-cervezas.html')) {
        const cervezaArticles = document.querySelectorAll('article');
        // Define un arreglo con los IDs reales para cada cerveza
        cervezaArticles.forEach((article) => {
            const cervezaId = article.getAttribute('data-cerveza-id') || 1;
            let productName;
            // Puedes mantener la lógica para asignar nombres o incluso extraerlo del HTML
            const titulo = article.querySelector('h2');
            if (titulo) {
              productName = titulo.textContent.trim();
            }
  
        const quantityControls = document.createElement('div');
        quantityControls.className = 'quantity-controls';
        // Aquí se asigna el ID real mediante data-product-id
        quantityControls.innerHTML = `
          <div class="quantity-input">
            <button class="quantity-btn minus">-</button>
            <input type="number" value="1" min="1" class="quantity" data-product-id="${cervezaId}">
            <button class="quantity-btn plus">+</button>
          </div>
          <div class="presentation-options">
            <button class="presentation-btn" data-presentation="Lata">Lata</button>
            <button class="presentation-btn" data-presentation="Botella">Botella</button>
            <button class="presentation-btn" data-presentation="Barril">Barril</button>
          </div>
          <button class="add-to-cart-btn" data-product-id="${cervezaId}" data-price="12000">Añadir al carrito</button>
        `;
        article.appendChild(quantityControls);
  
        // Eventos para ajustar la cantidad
        const minusBtn = quantityControls.querySelector('.minus');
        const plusBtn = quantityControls.querySelector('.plus');
        const quantityInput = quantityControls.querySelector('.quantity');
        const addToCartBtn = quantityControls.querySelector('.add-to-cart-btn');
  
        if (minusBtn && quantityInput) {
          minusBtn.addEventListener('click', function () {
            let value = parseInt(quantityInput.value);
            if (value > 1) quantityInput.value = value - 1;
          });
        }
        if (plusBtn && quantityInput) {
          plusBtn.addEventListener('click', function () {
            let value = parseInt(quantityInput.value);
            quantityInput.value = value + 1;
          });
        }
  
        // Manejar selección de presentación
        const presentationBtns = quantityControls.querySelectorAll('.presentation-btn');
        presentationBtns.forEach(btn => {
          btn.addEventListener('click', function () {
            presentationBtns.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
          });
        });
        // Por defecto, seleccionar "Lata"
        if (presentationBtns.length > 0) {
          presentationBtns[0].classList.add('selected');
        }
  
        // Evento para agregar al carrito
        if (addToCartBtn && quantityInput) {
          addToCartBtn.addEventListener('click', function () {
            const dataUser = sessionStorage.getItem('dataUser');
            if (!dataUser) {
              alert('Debes iniciar sesión para añadir productos al carrito');
              // Asumiendo que tienes definido el modal de login (loginModal)
              if (typeof loginModal !== 'undefined') loginModal.style.display = 'block';
              return;
            }
            // Obtener la presentación seleccionada
            const selectedPresentationBtn = quantityControls.querySelector('.presentation-btn.selected');
            const presentacion = selectedPresentationBtn
              ? selectedPresentationBtn.getAttribute('data-presentation')
              : 'Lata';
            // Obtener el ID real del producto
            const cervezaId = this.getAttribute('data-product-id');
            const cantidad = parseInt(quantityInput.value);
            const precio = parseFloat(this.getAttribute('data-price'));
            addToCartAPI(cervezaId, cantidad, precio, presentacion);
          });
        }
      });
    }
  }
  setupProductQuantityControls();
  
  function addToCartAPI(cervezaId, cantidad, precio, presentacion) {
    const dataUser = JSON.parse(sessionStorage.getItem('dataUser'));
    if (!dataUser) {
      alert('Debes iniciar sesión para añadir productos al carrito');
      return;
    }
    const usuarioId = dataUser.id;
  
    // Convertir el ID de cerveza a número
    const cervezaIdNum = parseInt(cervezaId);
    // Mapear la presentación a su ID
    const presentacionIdNum = isNaN(presentacion) ? mapearPresentacionId(presentacion) : parseInt(presentacion);
  
    // Crear el objeto payload conforme a la entidad Carrito en el backend
    const itemCarrito = {
      cantidad: cantidad,
      cerveza: { id: cervezaIdNum },
      presentacione: { id: presentacionIdNum },
      usuario: { id: usuarioId }
    };
  
    console.log('Enviando al carrito:', JSON.stringify(itemCarrito));
  
    fetch('http://localhost:8080/carrito/addCarrito', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemCarrito)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al agregar al carrito en la API');
        }
        return response.json();
      })
      .then(data => {
        alert(`${cantidad} producto(s) añadido(s) al carrito`);
        updateCartCount();
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error al agregar al carrito: ' + error.message);
      });
  }
  
  // Función para mapear presentaciones a IDs (ajusta según tu base de datos)
  function mapearPresentacionId(presentacion) {
    const mapeo = {
      'Lata': 1,
      'Botella': 2,
      'Barril': 3
    };
    return mapeo[presentacion] || 1;
  }
  
  // Actualiza el contador del carrito consultando la API y filtrando por usuario
  function updateCartCount() {
    const dataUser = JSON.parse(sessionStorage.getItem('dataUser'));
    if (!dataUser) return;
    const usuarioId = dataUser.id;
    fetch('http://localhost:8080/carrito/getCarrito', { method: 'GET' })
      .then(response => {
        if (!response.ok) throw new Error('No se pudo obtener el carrito');
        return response.json();
      })
      .then(carritos => {
        // Filtrar solo los items del usuario actual
        const userCarrito = carritos.filter(item => item && item.usuario && item.usuario.id === usuarioId);
        
        const totalItems = userCarrito.reduce((total, item) => total + item.cantidad, 0);
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
          cartCountElement.textContent = totalItems;
        }
      })
      .catch(error => console.error(error));
  }
  
  // Mostrar modal del carrito consultando la API
  function showCartModal(e) {
    if (e) e.preventDefault();
    const dataUser = JSON.parse(sessionStorage.getItem('dataUser'));
    if (!dataUser) {
      alert('Debes iniciar sesión para ver el carrito');
      return;
    }
    const usuarioId = dataUser.id;
    fetch('http://localhost:8080/carrito/getCarrito', { method: 'GET' })
      .then(response => {
        if (!response.ok) throw new Error('No se pudo obtener el carrito');
        return response.json();
      })
      .then(carritos => {
        // Filtrar solo los items del usuario actual
        const cartItems = carritos.filter(item => item && item.usuario && item.usuario.id === usuarioId);
        let cartModal = document.getElementById('cart-modal');
        if (!cartModal) {
          cartModal = document.createElement('div');
          cartModal.id = 'cart-modal';
          cartModal.className = 'modal';
          document.body.appendChild(cartModal);
        }
        const total = cartItems.reduce((sum, item) => sum + (item.cerveza.precio * item.cantidad || 0), 0);
        cartModal.innerHTML = `
          <div class="modal-content">
            <span class="close">&times;</span>
            <div class="cart-container">
              <h1>Mi Carrito</h1>
              ${cartItems.length === 0 ? '<p>Tu carrito está vacío</p>' : ''}
              <div class="cart-items">
                ${cartItems.map(item => `
                  <div class="cart-item">
                    <span class="item-name">Cerveza: ${item.cerveza.id} / ${item.cerveza.nombre || ''}</span>
                    <span class="item-quantity">Cantidad: ${item.cantidad}</span>
                    <span class="item-presentation">Presentación: ${item.presentacione.id} / ${item.presentacione.nombre || ''}</span>
                    <button class="remove-item" data-itemid="${item.id}">Eliminar</button>
                  </div>
                `).join('')}
              </div>
              ${cartItems.length > 0 ? `
                <div class="cart-total">
                  <strong>Total: $${total.toLocaleString()}</strong>
                </div>
                <div class="cart-actions">
                  <button id="checkout-btn" class="btn">Finalizar Compra</button>
                  <button id="clear-cart-btn" class="btn">Vaciar Carrito</button>
                </div>
              ` : ''}
            </div>
          </div>
        `;
        const closeBtn = cartModal.querySelector('.close');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            cartModal.style.display = 'none';
          });
        }
        window.addEventListener('click', function (event) {
          if (event.target === cartModal) cartModal.style.display = 'none';
        });
        // Manejar eliminación individual
        if (cartItems.length > 0) {
          document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function () {
              const itemId = this.getAttribute('data-itemid');
              fetch(`http://localhost:8080/carrito/deleteCarrito/${itemId}`, { method: 'DELETE' })
                .then(response => {
                  if (!response.ok) throw new Error('No se pudo eliminar el ítem');
                  return response.text();
                })
                .then(() => {
                  alert('Producto eliminado del carrito');
                  updateCartCount();
                  showCartModal();
                })
                .catch(err => alert(err));
            });
          });
          // Vaciar carrito (se asume que el endpoint filtra por usuario)
          const clearCartBtn = document.getElementById('clear-cart-btn');
          if (clearCartBtn) {
            clearCartBtn.addEventListener('click', function () {
              fetch(`http://localhost:8080/carrito/deleteCarrito/}`, { method: 'DELETE' })
                .then(response => {
                  if (!response.ok) throw new Error('No se pudo vaciar el carrito');
                  return response.text();
                })
                .then(() => {
                  alert('Carrito vaciado');
                  updateCartCount();
                  cartModal.style.display = 'none';
                })
                .catch(err => alert(err));
            });
          }
          // Finalizar compra
          const checkoutBtn = document.getElementById('checkout-btn');
          if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function () {
              const direccionEnvio = prompt('Ingresa tu dirección de envío:');
              const fechaOrden = prompt('Ingresa la fecha que quieres que llegue tu envío:');
              if (!direccionEnvio && !fechaOrden) {
                alert('Debes ingresar una dirección de envío y una fecha de entrega');
                return;
              }
              const carritoId = cartItems.length > 0 && cartItems[0].carrito ? cartItems[0].carrito.id : null;

              if (!carritoId) {
                  alert('No se pudo obtener el ID del carrito.');
                  return;
              }
              const ordenPayload = {
                usuarioId: usuarioId,
                total: total,
                direccionEnvio: direccionEnvio,
                fechaOrden: fechaOrden,
                carritoId: carritoId,
                estado: "En espera",
                items: cartItems.map(item => ({
                    cervezaId: item.cerveza.id, // Enviar cervezaId directamente
                    presentacionId: item.presentacione.id,
                    cantidad: item.cantidad,
                    precio: item.cerveza.precio
                }))
            };
              fetch('http://localhost:8080/ordenes/addOrdenes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ordenPayload)
              })
                .then(response => {
                  if (!response.ok) throw new Error('No se pudo finalizar la compra');
                  return response.json();
                })
                .then(orderData => {
                  alert('Compra finalizada. Tu número de orden es: ' + orderData.id);
                  // Vaciar carrito después del checkout
                  fetch(`http://localhost:8080/carrito/deleteCarrito/${usuarioId}`, { method: 'DELETE' })
                    .then(() => {
                      updateCartCount();
                      cartModal.style.display = 'none';
                    });
                })
                .catch(err => alert(err));
            });
          }
        }
        cartModal.style.display = 'block';
      })
      .catch(error => alert('Error al mostrar el carrito: ' + error.message));
  }
  
  
    });