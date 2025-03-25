document.addEventListener('DOMContentLoaded', function() {

    // Funciones del modal login y registro.
    const loginModal = document.getElementById("login-modal");
    const loginBtn = document.getElementById("login-btn");
    const closeLoginBtn = document.getElementsByClassName("close")[0];
    const registerLink = document.querySelector(".register-link a");
    const registerModal = document.getElementById('register-modal');
    const closeRegisterBtn = document.querySelector('.close-register');
    const loginLink = document.getElementById('login-link');
    
    // Para abrir login cuando clickee iniciar sesion
    if (loginBtn) {loginBtn.onclick = () => loginModal.style.display = "block";}
        
    // Para abrir registro desde login
    if (registerLink) {
        registerLink.onclick = (e) => {
            e.preventDefault();
            loginModal.style.display = "none";
            registerModal.style.display = "block";
        }}

    // Para abrir login desde registro
    if (loginLink) {
        loginLink.onclick = (e) => {
            e.preventDefault();
            registerModal.style.display = "none";
            loginModal.style.display = "block";
        }}

    // Cuando se da click en el span (x)        
    if (closeRegisterBtn || closeLoginBtn) {
        if (closeLoginBtn) {
            closeLoginBtn.addEventListener('click', function() {
                loginModal.style.display = 'none';
            });}
        if (closeRegisterBtn) {
            closeRegisterBtn.addEventListener('click', function() {
                registerModal.style.display = 'none';
            });
        }}
    
    // Para cerrar cuando se da click afuera
    window.onclick = (e) => {
        if (e.target == loginModal || e.target == registerModal) {
            if (loginModal) loginModal.style.display = "none";
            if (registerModal) registerModal.style.display = "none";
        }}
    
    // Verificar si hay usuario logueado
    userLogged();

    // Función de login
    function loginForm(e) {
        e.preventDefault();

        // Obtener valores de inputs
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Validar campos vacios
        if(!email || !password){
            alert('Por favor, complete todos los campos');
            return;
        }
        // Llamar API para verificar datos 
        fetch('http://localhost:8080/usuario/getUsuarioByEmail/' + encodeURIComponent(email), {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(response => {
            if(!response.ok){
                alert('Usuario no encontrado');
            }        
            return response.json();
        })
        .then(user => {
            if(user && user.password === password){
                // Login exitoso y guarda informacion del usuario en almacenamiento de la web
                sessionStorage.setItem('dataUser', JSON.stringify({// el set item lo que hace es guardar informacion en el almacenamiento de la web y con el stringify lo que hace es convertir el objeto almacenado en un string
                    id: user.id,
                    nombre: user.nombre,
                    apellido: user.apellido,
                    email: user.email,
                    edad: user.edad,
                    tipoUsuario: user.tipoUsuario
                })); 

                // Cerrar modal del login 
                loginModal.style.display = 'none';

                // Actualiza interfaz para usuario logueado
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
    
    // Asociar el evento submit al formulario de login
    const formLogin = document.querySelector('.login-container form');
    if (formLogin) {
        formLogin.addEventListener('submit', loginForm);
    }

    // Registro en la base de datos
    const registerForm = document.querySelector('.register-container form');    
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
           
            event.preventDefault();
            
            // obtener valores de inputs
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
            
            // Enviar data al servidor
            fetch('http://localhost:8080/usuario/addUsuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario) // Convertir objeto a JSON
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en el registro');
                }
                return response.json();
            })
            .then(data => {
                alert('Registro exitoso');
                // Limpiar formulario
                registerForm.reset();
                // Cerrar modal de registro y abrir el de login
                if (registerModal) registerModal.style.display = 'none';
                if (loginModal) loginModal.style.display = 'block';
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error en el registro: ' + error.message);
            });
        });
    }
    
    // Función para verificar si hay un usuario logueado
    function userLogged() {
        const dataUser = sessionStorage.getItem('dataUser');
        if (dataUser) {
            updateUIForUserLog();
        } else {
            UIForInvitado();
        }
    }

    // Actualizar interfaz si se loguea
    function updateUIForUserLog() {
        const dataUser = JSON.parse(sessionStorage.getItem('dataUser'));

        if (dataUser) {
            // Obtener barra de navegación
            const navBar = document.querySelector('nav.navigation ul');
            if (!navBar) return;
            
            const navItem = navBar.querySelector('li:last-child');
            if (navItem) {
                navItem.innerHTML = `
                    <div class="perfil">
                        <button class="perfil-btn">${dataUser.nombre} ▼</button>
                        <div class="perfil-contenido">
                            <a href="#" id="ver-perfil">Mi Perfil</a>
                            <a href="#" id="ver-orden">Mis Pedidos</a>
                            <a href="#" id="logout-btn">Cerrar Sesión</a>
                        </div>
                    </div>`;
                
                // Añadir item para el carrito
                const cartLi = document.createElement('li');
                cartLi.innerHTML = `<a href="#" id="cart-btn" class="cart-button">🛒 <span class="cart-count">0</span></a>`;
                navBar.appendChild(cartLi);
                
                // Añadir eventos al menu del perfil
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
                
                // Evento al boton del carro
                // const cartBtn = document.getElementById('cart-btn');
                // if (cartBtn) {
                //     cartBtn.addEventListener('click', showCartModal);
                // }
                
                // // Actualizar contador del carrito
                // updateCartCount();
            }
        }
    }

    // Funcion para poner interfaz de invitado
    function UIForInvitado() {
        const navBar = document.querySelector('nav.navigation ul');
        if (!navBar) return;
        
        // Eliminar botón de carrito si existe
        const cartLi = document.getElementById('cart-btn');
        if (cartLi && cartLi.parentNode) {
            cartLi.parentNode.remove();
        }

        // Mostrar de nuevo boton de ingresar
        const perfilLi = navBar.querySelector('li:last-child');
        if (perfilLi) {
            if (perfilLi.querySelector('.perfil')) {
                perfilLi.innerHTML = `<button id="login-btn" class="login-button">Iniciar Sesión</button>`;
                
                // Restaurar evento del botón
                const newLoginBtn = document.getElementById('login-btn');
                if (newLoginBtn && loginModal) {
                    newLoginBtn.addEventListener('click', () => {
                        loginModal.style.display = 'block';
                    });
                }
            }
        }
    }

    // Función para mostrar perfil
    function mostrarPerfil(e) {
        if (e) e.preventDefault();
    
        const dataUser = JSON.parse(sessionStorage.getItem('dataUser'));
        if (!dataUser) {
            alert('No hay usuario logueado');
            return;
        }
    
        // Declarar profileModal fuera del bloque if
        let profileModal = document.getElementById('profile-modal');
    
        if (!profileModal) {
            // Crear el modal
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
    
            // Añadir evento para cerrar
            profileModal.querySelector('.close').addEventListener('click', () => {
                profileModal.style.display = 'none';
            });
    
            // Cerrar al hacer clic fuera
            window.addEventListener('click', (e) => {
                if (e.target == profileModal) {
                    profileModal.style.display = 'none';
                }
            });
    
            // Evento para editar perfil
            const editProfileBtn = document.getElementById('edit-profile-btn');
            if (editProfileBtn) {
                editProfileBtn.addEventListener('click', () => {
                    alert('Funcionalidad de edición de perfil en desarrollo');
                });
            }
        }
    
        // Mostrar datos del perfil
        const profileName = document.getElementById('profile-name');
        if (profileName) profileName.textContent = dataUser.nombre || '';
    
        const profileLastname = document.getElementById('profile-lastname');
        if (profileLastname) profileLastname.textContent = dataUser.apellido || '';
    
        const profileEmail = document.getElementById('profile-email');
        if (profileEmail) profileEmail.textContent = dataUser.email || '';
    
        const profileType = document.getElementById('profile-type');
        if (profileType) profileType.textContent = dataUser.tipoUsuario || ''; // revisar esta parte
    
        // Mostrar modal
        profileModal.style.display = 'block';
    }

    // // Función para configurar controles de cantidad en productos
    // function setupProductQuantityControls() {
    //     // Verificar si estamos en la página de cervezas
    //     if (window.location.href.includes('Nuestras_cervezas.html')) {
    //         // Obtener todos los artículos de cerveza
    //         const cervezaArticles = cervezasSection.querySelectorAll('article');
            
    //         cervezaArticles.forEach((article, index) => {
    //             // Crear nombres de producto basados en el contenido
    //             let productName;
    //             if (index === 0) productName = 'Cerveza Açaí';
    //             else if (index === 1) productName = 'Cerveza Aráza';
    //             else productName = 'Cerveza Dual';
                
    //             // Crear un div para los controles de cantidad
    //             const quantityControls = document.createElement('div');
    //             quantityControls.className = 'quantity-controls';
    //             quantityControls.innerHTML = `
    //                 <div class="quantity-input">
    //                     <button class="quantity-btn minus">-</button>
    //                     <input type="number" value="1" min="1" class="quantity" data-product="${productName}">
    //                     <button class="quantity-btn plus">+</button>
    //                 </div>
    //                 <button class="add-to-cart-btn" data-product="${productName}" data-price="12000">Añadir al carrito</button>
    //             `;
                
    //             // Añadir los controles al final del artículo
    //             article.appendChild(quantityControls);
                
    //             // Configurar eventos para los botones de cantidad
    //             const minusBtn = quantityControls.querySelector('.minus');
    //             const plusBtn = quantityControls.querySelector('.plus');
    //             const quantityInput = quantityControls.querySelector('.quantity');
    //             const addToCartBtn = quantityControls.querySelector('.add-to-cart-btn');
                
    //             if (minusBtn && quantityInput) {
    //                 minusBtn.addEventListener('click', function() {
    //                     let value = parseInt(quantityInput.value);
    //                     if (value > 1) {
    //                         quantityInput.value = value - 1;
    //                     }
    //                 });
    //             }
                
    //             if (plusBtn && quantityInput) {
    //                 plusBtn.addEventListener('click', function() {
    //                     let value = parseInt(quantityInput.value);
    //                     quantityInput.value = value + 1;
    //                 });
    //             }
                
    //             if (addToCartBtn && quantityInput) {
    //                 addToCartBtn.addEventListener('click', function() {
    //                     // Verificar si el usuario está logueado
    //                     if (!sessionStorage.getItem('dataUser')) {
    //                         alert('Debes iniciar sesión para añadir productos al carrito');
    //                         if (loginModal) loginModal.style.display = 'block';
    //                         return;
    //                     }
                        
    //                     // Añadir al carrito
    //                     addToCart(
    //                         this.getAttribute('data-product'),
    //                         parseInt(quantityInput.value),
    //                         parseFloat(this.getAttribute('data-price'))
    //                     );
    //                 });
    //             }
    //         });
    //     }
    // }

    // // Llamar a la función para configurar los controles de cantidad
    // setupProductQuantityControls();

    // // Función para añadir productos al carrito
    // function addToCart(product, quantity, price) {
    //     // Obtener el carrito actual o crear uno nuevo
    //     let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        
    //     // Buscar si el producto ya está en el carrito
    //     const existingProductIndex = cart.findIndex(item => item.product === product);
        
    //     if (existingProductIndex >= 0) {
    //         // Actualizar cantidad si ya existe
    //         cart[existingProductIndex].quantity += quantity;
    //     } else {
    //         // Añadir nuevo producto
    //         cart.push({
    //             product: product,
    //             quantity: quantity,
    //             price: price
    //         });
    //     }
        
    //     // Guardar carrito actualizado
    //     sessionStorage.setItem('cart', JSON.stringify(cart));
        
    //     // Actualizar contador del carrito
    //     updateCartCount();
        
    //     // Mostrar mensaje
    //     alert(`${quantity} ${product}(s) añadido(s) al carrito`);
    // }

    // // Función para actualizar el contador del carrito
    // function updateCartCount() {
    //     const cartCountElement = document.querySelector('.cart-count');
        
    //     if (cartCountElement) {
    //         const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    //         const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    //         cartCountElement.textContent = totalItems;
    //     }
    // }

    // // Función para mostrar el modal del carrito
    // function showCartModal(e) {
    //     if (e) e.preventDefault();
        
    //     // Obtener carrito
    //     const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        
    //     // Crear o actualizar modal
    //     let cartModal = document.getElementById('cart-modal');
        
    //     if (!cartModal) {
    //         cartModal = document.createElement('div');
    //         cartModal.id = 'cart-modal';
    //         cartModal.className = 'modal';
            
    //         document.body.appendChild(cartModal);
    //     }
        
        
    //     // Calcular total
    //     const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
    //     // Actualizar contenido
    //     cartModal.innerHTML = `
    //         <div class="modal-content">
    //             <span class="close">&times;</span>
    //             <div class="cart-container">
    //                 <h1>Mi Carrito</h1>
    //                 ${cart.length === 0 ? '<p>Tu carrito está vacío</p>' : ''}
    //                 <div class="cart-items">
    //                     ${cart.map(item => `
    //                         <div class="cart-item">
    //                             <span class="item-name">${item.product}</span>
    //                             <span class="item-quantity">Cantidad: ${item.quantity}</span>
    //                             <span class="item-price">Precio: $${item.price.toLocaleString()}</span>
    //                             <span class="item-subtotal">Subtotal: $${(item.price * item.quantity).toLocaleString()}</span>
    //                             <button class="remove-item" data-product="${item.product}">Eliminar</button>
    //                         </div>
    //                     `).join('')}
    //                 </div>
    //                 ${cart.length > 0 ? `
    //                     <div class="cart-total">
    //                         <strong>Total: $${total.toLocaleString()}</strong>
    //                     </div>
    //                     <div class="cart-actions">
    //                         <button id="checkout-btn" class="btn">Finalizar Compra</button>
    //                         <button id="clear-cart-btn" class="btn">Vaciar Carrito</button>
    //                     </div>
    //                 ` : ''}
    //             </div>
    //         </div>
    //     `;
        
    //     // Configurar eventos
    //     const closeBtn = cartModal.querySelector('.close');
    //     if (closeBtn) {
    //         closeBtn.addEventListener('click', function() {
    //             cartModal.style.display = 'none';
    //         });
    //     }
        
    //     window.addEventListener('click', function(event) {
    //         if (event.target == cartModal) {
    //             cartModal.style.display = 'none';
    //         }
    //     });
        
    //     // Añadir eventos a botones si hay productos
    //     if (cart.length > 0) {
    //         // Botón de checkout
    //         const checkoutBtn = document.getElementById('checkout-btn');
    //         if (checkoutBtn) {
    //             checkoutBtn.addEventListener('click', function() {
    //                 alert('Funcionalidad de pago en desarrollo');
    //             });
    //         }
            
    //         // Botón para vaciar carrito
    //         const clearCartBtn = document.getElementById('clear-cart-btn');
    //         if (clearCartBtn) {
    //             clearCartBtn.addEventListener('click', function() {
    //                 sessionStorage.removeItem('cart');
    //                 updateCartCount();
    //                 cartModal.style.display = 'none';
    //                 alert('Carrito vaciado');
    //             });
    //         }
            
    //         // Botones para eliminar productos individuales
    //         document.querySelectorAll('.remove-item').forEach(button => {
    //             button.addEventListener('click', function() {
    //                 const productToRemove = this.getAttribute('data-product');
    //                 const updatedCart = cart.filter(item => item.product !== productToRemove);
    //                 sessionStorage.setItem('cart', JSON.stringify(updatedCart));
    //                 updateCartCount();
    //                 showCartModal(); // Actualizar modal
    //             });
    //         });
    //     }
        
    //     // Mostrar modal
    //     cartModal.style.display = 'block';
    // }
});