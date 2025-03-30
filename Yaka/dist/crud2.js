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
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (!email || !password) {
      alert('Por favor, complete todos los campos');
      return;
    }
    fetch('http://localhost:8080/usuario/getUsuarioByEmail/' + encodeURIComponent(email), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        if (!response.ok) {
          alert('Usuario no encontrado');
        }
        return response.json();
      })
      .then(user => {
        if (user && user.password === password) {
          sessionStorage.setItem('dataUser', JSON.stringify({
            id: user.id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            edad: user.edad,
            role: user.role
          }));
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
  const formLogin = document.querySelector('.login-container form');
  if (formLogin) {
    formLogin.addEventListener('submit', loginForm);
  }

  // Registro en la base de datos
  const registerForm = document.querySelector('.register-container form');
  if (registerForm) {
    registerForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const nombre = document.getElementById('nombre').value;
      const apellido = document.getElementById('apellido').value;
      const email = document.getElementById('reg-email').value;
      const edad = document.getElementById('edad').value;
      const password = document.getElementById('reg-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }
      const usuario = {
        nombre: nombre,
        apellido: apellido,
        email: email,
        edad: parseInt(edad),
        password: password
      };
      fetch('http://localhost:8080/usuario/addUsuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  // Verificar usuario logueado y actualizar UI
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
        const cartLi = document.createElement('li');
        cartLi.innerHTML = `<a href="#" id="cart-btn" class="cart-button">🛒 <span class="cart-count">0</span></a>`;
        navBar.appendChild(cartLi);
        const btnPerfil = navBar.querySelector('.perfil-btn');
        const perfilContenido = navBar.querySelector('.perfil-contenido');
        btnPerfil.addEventListener('click', function (e) {
          e.stopPropagation();
          perfilContenido.style.display = perfilContenido.style.display === "block" ? "none" : "block";
        });
        document.addEventListener('click', (e) => {
          if (!btnPerfil.contains(e.target) && !perfilContenido.contains(e.target)) {
            perfilContenido.style.display = "none";
          }
        });
        const verPerfil = document.getElementById('ver-perfil');
        if (verPerfil) {
          verPerfil.addEventListener('click', mostrarPerfil);
        }
        const verOrden = document.getElementById('ver-orden');
        if (verOrden) {
          verOrden.addEventListener('click', modalPedidos);
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
        updateCartCount();
      }
    }
  }

  // Modal de "Mis Pedidos"
  function modalPedidos() {
    let pedidosModal = document.getElementById('pedidos-modal');
    if (!pedidosModal) {
      pedidosModal = document.createElement('div');
      pedidosModal.id = 'pedidos-modal';
      pedidosModal.className = 'modal';
      pedidosModal.innerHTML = `
        <div class="modal-content">
          <span class="close">&times;</span>
          <div class="pedidos-container">
            <h1>Mis Pedidos</h1>
            <div id="orders-container">
              <!-- Aquí se renderizarán los pedidos -->
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(pedidosModal);
      pedidosModal.querySelector('.close').addEventListener('click', () => {
        pedidosModal.style.display = 'none';
      });
      window.addEventListener('click', (e) => {
        if (e.target === pedidosModal) {
          pedidosModal.style.display = 'none';
        }
      });
    }
    pedidosModal.style.display = 'block';
    const dataUser = JSON.parse(sessionStorage.getItem('dataUser'));
    if (dataUser) {
      fetch(`http://localhost:8080/ordenes/carrito/${dataUser.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al cargar las órdenes, código: ' + response.status);
          }
          return response.json();
        })
        .then(ordenes => {
          const ordersContainer = document.getElementById('orders-container');
          if (!ordersContainer) return;
          if (!ordenes || ordenes.length === 0) {
            ordersContainer.innerHTML = '<p>No se encontraron pedidos.</p>';
          } else {
            let ordenesHTML = '';
            ordenes.forEach(orden => {
              // Se incluye el id del carrito como data attribute para conservar la asociación
              ordenesHTML += `
                <div class="order-item" data-carritoid="${orden.carrito ? orden.carrito.id : ''}">
                  <p><strong>ID:</strong> ${orden.id}</p>
                  <p><strong>Fecha:</strong> ${orden.fechaOrden}</p>
                  <p><strong>Estado:</strong> ${orden.estado}</p>
                  <p><strong>Dirección:</strong> ${orden.direccionEnvio}</p>
                  <p><strong>Total:</strong> $${orden.total}</p>
                  <button class="edit-order" data-orderid="${orden.id}">Editar</button>
                  <button class="delete-order" data-orderid="${orden.id}">Eliminar</button>
                </div>
              `;
            });
            ordersContainer.innerHTML = ordenesHTML;
            // Evento para eliminar cada orden
            document.querySelectorAll('.delete-order').forEach(button => {
              button.addEventListener('click', function () {
                const orderId = this.getAttribute('data-orderid');
                deleteOrder(orderId);
              });
            });
            // Evento para editar cada orden
            document.querySelectorAll('.edit-order').forEach(button => {
              button.addEventListener('click', function () {
                const orderId = this.getAttribute('data-orderid');
                const orderDiv = this.parentElement;
                // Extraer datos actuales de la orden
                const currentFecha = orderDiv.querySelector('p:nth-child(2)').textContent.replace("Fecha:", "").trim();
                const currentDireccion = orderDiv.querySelector('p:nth-child(4)').textContent.replace("Dirección:", "").trim();
                const currentTotalText = orderDiv.querySelector('p:nth-child(5)').textContent.replace("Total:", "").replace("$", "").trim();
                const currentTotal = parseFloat(currentTotalText);
                // Obtener el id del carrito guardado como atributo
                const carritoId = orderDiv.getAttribute('data-carritoid');
                const newDireccion = prompt("Ingrese la nueva dirección de envío:", currentDireccion);
                const newFecha = prompt("Ingrese la nueva fecha de entrega (YYYY-MM-DD):", currentFecha);
                if(newDireccion && newFecha) {
                  const updatedOrder = {
                    direccionEnvio: newDireccion,
                    fechaOrden: newFecha,
                    estado: "Pendiente", // o el estado que corresponda
                    total: currentTotal || 0,
                    carrito: { id: carritoId }  // se conserva la asociación con el carrito
                  };
                  fetch(`http://localhost:8080/ordenes/updateOrdenes/${orderId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedOrder)
                  })
                    .then(response => {
                      if (!response.ok) throw new Error("Error al actualizar la orden");
                      return response.json();
                    })
                    .then(data => {
                      alert("Orden actualizada");
                      modalPedidos(); // refrescar la vista de órdenes
                    })
                    .catch(err => alert("Error: " + err.message));
                }
              });
            });
          }
        })
        .catch(error => {
          console.error('Error en el fetch:', error);
          const ordersContainer = document.getElementById('orders-container');
          if (ordersContainer) {
            ordersContainer.innerHTML = `<p>Error al cargar pedidos: ${error.message}</p>`;
          }
        });
    }
  }

  // Eliminar una orden
  function deleteOrder(orderId) {
    if (confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
      fetch(`http://localhost:8080/ordenes/deleteOrdenes/${orderId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al eliminar el pedido');
          }
          return response.json();
        })
        .then(data => {
          alert('Pedido eliminado correctamente');
          modalPedidos();
        })
        .catch(error => {
          console.error(error);
          alert('Error al eliminar el pedido: ' + error.message);
        });
    }
  }

  // Interfaz para invitado
  function UIForInvitado() {
    const navBar = document.querySelector('nav.navigation ul');
    if (!navBar) return;
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn && cartBtn.parentNode) {
      cartBtn.parentNode.remove();
    }
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

  // Mostrar perfil del usuario
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
      profileModal.querySelector('.close').addEventListener('click', () => {
        profileModal.style.display = 'none';
      });
      window.addEventListener('click', (e) => {
        if (e.target === profileModal) {
          profileModal.style.display = 'none';
        }
      });
      const editProfileBtn = document.getElementById('edit-profile-btn');
      if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
          alert('Funcionalidad de edición de perfil en desarrollo');
        });
      }
    }
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
      cervezaArticles.forEach((article) => {
        const cervezaId = article.getAttribute('data-cerveza-id') || 1;
        const quantityControls = document.createElement('div');
        quantityControls.className = 'quantity-controls';
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
          <button class="add-to-cart-btn" data-product-id="${cervezaId}">Añadir al carrito</button>
        `;
        article.appendChild(quantityControls);
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
        const presentationBtns = quantityControls.querySelectorAll('.presentation-btn');
        presentationBtns.forEach(btn => {
          btn.addEventListener('click', function () {
            presentationBtns.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
          });
        });
        if (presentationBtns.length > 0) {
          presentationBtns[0].classList.add('selected');
        }
        if (addToCartBtn && quantityInput) {
          addToCartBtn.addEventListener('click', function () {
            const dataUser = sessionStorage.getItem('dataUser');
            if (!dataUser) {
              alert('Debes iniciar sesión para añadir productos al carrito');
              if (typeof loginModal !== 'undefined') loginModal.style.display = 'block';
              return;
            }
            const selectedPresentationBtn = quantityControls.querySelector('.presentation-btn.selected');
            const presentacion = selectedPresentationBtn ? selectedPresentationBtn.getAttribute('data-presentation') : 'Lata';
            const cervezaId = this.getAttribute('data-product-id');
            const cantidad = parseInt(quantityInput.value);
            addToCartAPI(cervezaId, cantidad, presentacion);
          });
        }
      });
    }
  }
  setupProductQuantityControls();

  function addToCartAPI(cervezaId, cantidad, presentacion) {
    const dataUser = JSON.parse(sessionStorage.getItem('dataUser'));
    if (!dataUser) {
      alert('Debes iniciar sesión para añadir productos al carrito');
      return;
    }
    const usuarioId = dataUser.id;
    const cervezaIdNum = parseInt(cervezaId);
    const presentacionIdNum = isNaN(presentacion) ? mapearPresentacionId(presentacion) : parseInt(presentacion);
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

  function mapearPresentacionId(presentacion) {
    const mapeo = { 'Lata': 1, 'Botella': 2, 'Barril': 3 };
    return mapeo[presentacion] || 1;
  }

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
        const userCarrito = carritos.filter(item => item && item.usuario && item.usuario.id === usuarioId);
        const totalItems = userCarrito.reduce((total, item) => total + item.cantidad, 0);
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
          cartCountElement.textContent = totalItems;
        }
      })
      .catch(error => console.error(error));
  }

  // Función para mostrar el modal del carrito con opciones de editar y confirmar orden
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
        const cartItems = carritos.filter(item => item && item.usuario && item.usuario.id === usuarioId);
        let cartModal = document.getElementById('cart-modal');
        if (!cartModal) {
          cartModal = document.createElement('div');
          cartModal.id = 'cart-modal';
          cartModal.className = 'modal';
          document.body.appendChild(cartModal);
        }
        const total = cartItems.reduce((sum, item) => sum + (item.presentacione.precio * item.cantidad || 0), 0);
        cartModal.innerHTML = `
          <div class="modal-content">
            <span class="close">&times;</span>
            <div class="cart-container">
              <h1>Mi Carrito</h1>
              ${cartItems.length === 0 ? '<p>Tu carrito está vacío</p>' : ''}
              <div class="cart-items">
                ${cartItems.map(item => `
                    <div class="cart-item" data-productid="${item.cerveza.id}">
                      <span class="item-name">Cerveza: ${item.cerveza.id} / ${item.cerveza.nombre || ''}</span>
                      <span class="item-quantity">Cantidad: ${item.cantidad}</span>
                      <span class="item-presentation">Presentación: ${item.presentacione.id} / ${item.presentacione.nombre || ''}</span>
                      <button class="edit-item" data-itemid="${item.id}">Editar</button>
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
        
        // Cerrar el modal con el botón "X"
        const closeBtn = cartModal.querySelector('.close');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            cartModal.style.display = 'none';
          });
        }
        window.addEventListener('click', function (event) {
          if (event.target === cartModal) cartModal.style.display = 'none';
        });
        
        // Botón "Eliminar"
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
        
        // Botón "Editar" para ítems del carrito
document.querySelectorAll('.edit-item').forEach(button => {
  button.addEventListener('click', function () {
    const cartItemId = this.getAttribute('data-itemid');
    // Obtén el id del producto (cerveza) del contenedor del item
    const productId = this.parentElement.getAttribute('data-productid');
    const newQuantity = prompt("Ingrese la nueva cantidad", "1");
    const newPresentation = prompt("Ingrese la nueva presentación (Lata, Botella, Barril)", "Lata");
    if (newQuantity && newPresentation) {
      const updatedItem = {
        // Incluimos el id del carrito para que la API sepa qué registro actualizar
        id: parseInt(cartItemId),
        cantidad: parseInt(newQuantity),
        // Usamos el id obtenido del atributo, no el cartItemId
        cerveza: { id: parseInt(productId) },
        presentacione: { id: mapearPresentacionId(newPresentation) },
        usuario: { id: dataUser.id } // Asumiendo que dataUser está definido en el scope
      };
      fetch(`http://localhost:8080/carrito/updateCarrito/${cartItemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Error al actualizar el carrito");
          }
          return response.json();
        })
        .then(data => {
          alert("Carrito actualizado");
          showCartModal();
        })
        .catch(err => alert("Error: " + err.message));
    }
  });
});
        
        // Botón "Vaciar Carrito" (opcional)
        const clearCartBtn = document.getElementById('clear-cart-btn');
        if (clearCartBtn) {
          clearCartBtn.addEventListener('click', function () {
            const deletePromises = cartItems.map(item => {
              return fetch(`http://localhost:8080/carrito/deleteCarrito/${item.id}`, { method: 'DELETE' })
                .then(response => {
                  if (!response.ok) throw new Error(`Falló al eliminar el ítem ${item.id}`);
                  return response.text();
                });
            });
            Promise.all(deletePromises)
              .then(() => {
                alert('Carrito vaciado correctamente');
                updateCartCount();
                cartModal.style.display = 'none';
              })
              .catch(err => {
                alert('Error: ' + err.message);
              });
          });
        }
        
        // Botón "Finalizar Compra": se muestra prompt, se confirma la orden y se cierra el modal
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
          checkoutBtn.addEventListener('click', function () {
            const fechaPrompt = document.createElement('div');
            fechaPrompt.innerHTML = `
              <div style="position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index:9999;">
                <div style="background:white; padding:20px; border-radius:5px; width:300px;">
                  <h3>Información de envío</h3>
                  <div style="margin-bottom:10px;">
                    <label>Dirección de envío:</label>
                    <input type="text" id="direccion-input" style="width:100%; padding:5px;">
                  </div>
                  <div style="margin-bottom:15px;">
                    <label>Fecha de entrega:</label>
                    <input type="date" id="fecha-input" style="width:100%; padding:5px;">
                  </div>
                  <div style="display:flex; justify-content:space-between;">
                    <button id="cancel-order" style="padding:5px 10px;">Cancelar</button>
                    <button id="confirm-order" style="padding:5px 10px; background:#4CAF50; color:white; border:none;">Confirmar</button>
                  </div>
                </div>
              </div>
            `;
            document.body.appendChild(fechaPrompt);
            const fechaHoy = new Date().toISOString().split('T')[0];
            document.getElementById('fecha-input').min = fechaHoy;
            document.getElementById('cancel-order').addEventListener('click', () => {
              document.body.removeChild(fechaPrompt);
            });
            document.getElementById('confirm-order').addEventListener('click', () => {
              const direccionEnvio = document.getElementById('direccion-input').value;
              const fechaInput = document.getElementById('fecha-input').value;
              if (!direccionEnvio || !fechaInput) {
                alert('Debes ingresar una dirección de envío y una fecha de entrega');
                return;
              }
              alert('Orden confirmada');
              document.body.removeChild(fechaPrompt);
              cartModal.style.display = 'none';
            });
          });
        }
        cartModal.style.display = 'block';
      })
      .catch(error => alert('Error al mostrar el carrito: ' + error.message));
  }
});
