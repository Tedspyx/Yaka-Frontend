function addToCart(product, quantity, price) {
    // 1) Obtener el ID del usuario logueado
    const dataUser = JSON.parse(sessionStorage.getItem('dataUser'));
    if (!dataUser) {
      alert('Debes iniciar sesión para añadir productos al carrito');
      return;
    }
    const userId = dataUser.id;
  
    // 2) Llamar a tu API para crear/actualizar un ítem en el carrito
    // Asumiendo que tienes un endpoint POST /carrito que recibe:
    // { "usuarioId":..., "presentacionId":..., "cantidad":... }
  
    // Necesitas conocer el ID de la presentación: "Lata", "Botella", etc.
    // Lo ideal es que, en tu frontend, cada "product" tenga un ID real que exista en tu tabla "presentaciones".
    // Por simplicidad, supongamos que "product" = ID de la presentación en la BD
    // y "price" = su precio. Ajusta según tu estructura real.
  
    const itemCarrito = {
      usuarioId: userId,
      presentacionId: product,  // O un ID numérico
      cantidad: quantity
    };
  
    fetch('http://localhost:8080/carrito', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(itemCarrito)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al guardar en el carrito');
      }
      return response.json();
    })
    .then(data => {
      alert(`${quantity} unidad(es) del producto con ID=${product} añadida(s) al carrito en BD`);
      // Podrías también actualizar un "cart" en sessionStorage,
      // pero la fuente de la verdad ya sería la BD.
    })
    .catch(error => {
      console.error(error);
      alert('Error agregando al carrito: ' + error.message);
    });
  }
  function showCartModal(e) {
    if (e) e.preventDefault();
  
    const dataUser = JSON.parse(sessionStorage.getItem('dataUser'));
    if (!dataUser) {
      alert('Debes iniciar sesión para ver el carrito');
      return;
    }
    const userId = dataUser.id;
  
    fetch(`http://localhost:8080/carrito/${userId}`, {
      method: 'GET'
    })
    .then(response => {
      if(!response.ok) {
        throw new Error('No se pudo obtener el carrito');
      }
      return response.json();
    })
    .then(cartItems => {
      // cartItems debe ser un array con la info de cada item (presentacion, cantidad, precio, etc.)
      // Luego generas el HTML dinámico del modal con cartItems, igual a como lo hacías con sessionStorage
  
      let cartModal = document.getElementById('cart-modal');
      if (!cartModal) {
        cartModal = document.createElement('div');
        cartModal.id = 'cart-modal';
        cartModal.className = 'modal';
        document.body.appendChild(cartModal);
      }
  
      // Calcular total
      const total = cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  
      cartModal.innerHTML = `
        <div class="modal-content">
          <span class="close">&times;</span>
          <div class="cart-container">
            <h1>Mi Carrito</h1>
            ${cartItems.length === 0 ? '<p>Tu carrito está vacío</p>' : ''}
            <div class="cart-items">
              ${cartItems.map(item => `
                <div class="cart-item">
                  <span class="item-name">${item.nombrePresentacion}</span>
                  <span class="item-quantity">Cantidad: ${item.cantidad}</span>
                  <span class="item-price">Precio: $${item.precio}</span>
                  <span class="item-subtotal">Subtotal: $${(item.precio * item.cantidad)}</span>
                  <button class="remove-item" data-id="${item.id}">Eliminar</button>
                </div>
              `).join('')}
            </div>
            ${cartItems.length > 0 ? `
              <div class="cart-total">
                <strong>Total: $${total}</strong>
              </div>
              <div class="cart-actions">
                <button id="checkout-btn" class="btn">Finalizar Compra</button>
                <button id="clear-cart-btn" class="btn">Vaciar Carrito</button>
              </div>
            ` : ''}
          </div>
        </div>
      `;
  
      // Cerrar modal al hacer clic en la X
      const closeBtn = cartModal.querySelector('.close');
      if (closeBtn) {
        closeBtn.addEventListener('click', function() {
          cartModal.style.display = 'none';
        });
      }
  
      // Cerrar modal al hacer clic fuera
      window.addEventListener('click', function(event) {
        if (event.target == cartModal) {
          cartModal.style.display = 'none';
        }
      });
  
      // Eventos de eliminar, vaciar, etc.
      if (cartItems.length > 0) {
        // Eliminar producto individual
        document.querySelectorAll('.remove-item').forEach(button => {
          button.addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            fetch(`http://localhost:8080/carrito/${itemId}`, {
              method: 'DELETE'
            })
            .then(response => {
              if(!response.ok) throw new Error('No se pudo eliminar');
              return response.text(); // O .json() según tu API
            })
            .then(data => {
              alert('Producto eliminado del carrito');
              showCartModal(); // recargar
            })
            .catch(err => alert(err));
          });
        });
  
        // Vaciar carrito
        const clearCartBtn = document.getElementById('clear-cart-btn');
        if (clearCartBtn) {
          clearCartBtn.addEventListener('click', function() {
            fetch(`http://localhost:8080/carrito/clear/${userId}`, {
              method: 'DELETE'
            })
            .then(response => {
              if(!response.ok) throw new Error('No se pudo vaciar el carrito');
              return response.text();
            })
            .then(data => {
              alert('Carrito vaciado');
              cartModal.style.display = 'none';
            })
            .catch(err => alert(err));
          });
        }
  
        // Finalizar compra
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
          checkoutBtn.addEventListener('click', function() {
            // Aquí llamarías a tu endpoint de "crear orden"
            // que normalmente pasará el userId y creará un registro
            // en la tabla 'ordenes' con los ítems del carrito.
            fetch('http://localhost:8080/ordenes', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ usuarioId: userId, /* más datos */ })
            })
            .then(response => {
              if(!response.ok) throw new Error('No se pudo crear la orden');
              return response.json();
            })
            .then(orderData => {
              alert('Compra finalizada. ID de orden: ' + orderData.id);
              cartModal.style.display = 'none';
            })
            .catch(err => alert(err));
          });
        }
      }
  
      cartModal.style.display = 'block';
    })
    .catch(error => {
      alert('Error al mostrar el carrito: ' + error.message);
    });
  }
    