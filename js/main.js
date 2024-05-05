// array de productos dinámico
class Producto{
  constructor(nombre, id, precio, stock, descripcion){
      this.nombre = nombre;
      this.id = id;
      this.precio = precio;
      this.stock = stock;
      this.descripcion = descripcion;
  }
}

// Declaraciones
const productosBase = [
  {nombre:"Memoria RAM DDR4 8GB", id:"001",precio:8000, stock:2, descripcion:"Memory Speed:2666/3000/3200MHz Memory Channel:Dual Channel"},
  {nombre:"Memoria RAM DDR4 16GB", id:"002", precio:15000, stock:9, descripcion:"Memory Speed:2666/3000/3200MHz Memory Channel:Dual Channel"},
  {nombre:"MEMORIA RAM DDR5 8GB", id:"003",  precio:16000, stock:5, descripcion:"Memory Speed: 4800, 5200, 5600, 6000, 6400, 6800 Channel:Dual Channel"},
  {nombre:"MEMORIA RAM DDR5 16GB", id:"004",  precio:23000, stock:8, descripcion:"Memory Speed: 4800, 5200, 5600, 6000, 6400, 6800 Channel:Dual Channel"},
  {nombre:"Disco SSD 120", id:"005",  precio:10000, stock:2, descripcion:"Tipo de memoria flash NAND: Célula de triple nivel (TLC) Factor de forma: 2.5 Interfaz: SATA 6Gb/s"},
  {nombre:"Disco SSD 240", id:"006",  precio:15000, stock:2, descripcion:"Tipo de memoria flash NAND: Célula de triple nivel (TLC) Factor de forma: 2.5 Interfaz: SATA 6Gb/s"},
  {nombre:"Disco SSD 480", id:"007",  precio:20000, stock:4, descripcion:"Tipo de memoria flash NAND: Célula de triple nivel (TLC) Factor de forma: 2.5 Interfaz: SATA 6Gb/s"},
  {nombre:"Disco HD 1TB", id:"008",  precio:20000, stock:2, descripcion:"Tamaño de disco duro: 3.5pulg. Interfaz: Serial ATA III Unidad RPM: 5900"},
  {nombre:"Disco HD 2TB", id:"009",  precio:30000, stock:5, descripcion:"Tamaño de disco duro: 3.5pulg. Interfaz: Serial ATA III Unidad RPM: 5900"},
  {nombre:"Gabinete KIT", id:"010",  precio:36000, stock:4, descripcion:"Gabinete generico con fuente teclado Mouse y parlantes de regalo"},
  {nombre:"Gabinete GAMER", id:"011",  precio:50000, stock:3, descripcion:"Gabinete sin Fuente y Luces Led"},
]
const productosDiv = document.getElementById('itemProducto');
const carritoUl = document.getElementById('itemsCompra');
let carrito = [];

// Muestra los productos en la pagina principal en un div usando card de Boostrap
// Muestra via modal los productos seleccionados
function mostrarProductos() {
  productosDiv.innerHTML = '';
  productosBase.forEach(itemProducto => {
    const productoDiv = document.createElement("div");
    productoDiv.classList.add("card", "col-xs");
    productoDiv.style = "width: 300px; height: 550px; margin:10px"
    productoDiv.innerHTML = `
      <div class="container text-center">
        <img src="./imgProductos/${itemProducto.id}.png" class="card-img-top"  alt="${itemProducto.nombre}">  
      </div>
      <div class="card-body">
        <h5 class="card-title">${itemProducto.nombre}</h5>
        <p class="card-text">Precio: $${itemProducto.precio}</p>
        <p class="card-text" id="prodStock${itemProducto.id}">Stock: ${itemProducto.stock}</p>
        <form  id="form${itemProducto.id}">
          <div class="row g-1">
            <div class="col-auto">    
              Cantidad:
            </div>
            <div class="col-4">
              <input class="form-control form-control-sm" type="number" min="0" max="${itemProducto.stock}" placeholder="0" id="contador${itemProducto.id}">
            </div>
            <div class="col-auto">
              <button class="btn btn-primary btn-sm" onclick="agregarCarrito('${itemProducto.id}',contador${itemProducto.id}.value )">Agregar</button>
            </div>
          </div>
        <div class="row p-2">
          <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalPago">
          Ver Carrito
          </button>
        </div>
      </div>
    </form>
    `;
    productosDiv.appendChild(productoDiv);
  });
}

function agregarCarrito(id, cantidad) {
  const itemProducto = productosBase.find(p => p.id === id);
  // valida si ingresa un valor mayor a 0, ya se elinó la cantidad negativa o mayor al stock en los imputs, 
  //pero igual lo testeamos para frenar si falla algo
  if (itemProducto && itemProducto.stock > 0) {
    if (cantidad > 0 && cantidad <= itemProducto.stock) {
      const carritoItem = carrito.find(item => item.id === id);
      if (carritoItem) {
        carritoItem.cantidad += parseInt(cantidad);
      } else {
        // agregamos cantidad en carrito
        carrito.push({ ...itemProducto, cantidad: parseInt(cantidad) });
      }
      // disminuimos el stock para actualizarlo en la pagina principal
      itemProducto.stock -= parseInt(cantidad);
      // mostramos el stock actualizado, cargamos la compra y guardamos en el local store
      mostrarProductos();
      itemCompra();
      guardarCarritoEnLocalStorage();    
      alert('Producto Agregagado.');
      // Mensajes de errores
    } else {
      alert('Seleccione una cantidad válida.');
    }
  } else {
    alert('No hay stock de este producto.');
  }
}

// Guarda en el Almacenamiento Local
function guardarCarritoEnLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// lista los productos comprados, su cantidad y precio
function itemCompra() {
  carritoUl.innerHTML = '';
  carrito.forEach(itemProducto => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    li.innerHTML = `
    ${itemProducto.cantidad} - ${itemProducto.nombre} - $${itemProducto.precio * itemProducto.cantidad}
      <button class="btn btn-danger btn-sm" onclick="eliminarProductoCarrito('${itemProducto.id}')">Eliminar Item</button>
    `;
    carritoUl.appendChild(li);
  });
}

// eliminar pruducto del carrito
function eliminarProductoCarrito(id) {
  const index = carrito.findIndex(item => item.id === id);
  if (index !== -1) {
    const item = carrito[index];
    const productoBase = productosBase.find(p => p.id === id);
    productoBase.stock += item.cantidad;
    carrito.splice(index, 1);
    // actualizamos stock despues de eliminar el producto del carrito
    mostrarProductos();
    itemCompra();
    guardarCarritoEnLocalStorage();
  }
}

// Leer almacenamiento local
function cargarCarritoDesdeLocalStorage() {
  const carritoGuardado = localStorage.getItem('carrito');
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    itemCompra();
  }
}

// Eliminar todos los productos del carrito
function vaciarCarrito () {
  localStorage.removeItem('carrito');
  location.reload();
}

// Previo a Finalizar la compra, muestra el detalle y calcula el total
function finalizarCarrito () {
  let total = 0;
  carrito.forEach(itemProducto => {
  total += itemProducto.precio * itemProducto.cantidad;
  });
  // verifico si compro algo sino muestro aviso de que no hay productos agregados
  if (total > 0) {
  valorFinalCompra.innerHTML = `
    <div class="container p-4">
      <div class="alert alert-success p-1" role="alert">
        <h4 class="alert-heading">Finalizar La compra</h4>
        <p>El valor total de la compra es: $${total}</p>  
        <hr>
        <p class="mb-0">Ingrese sus datos para que le enviemos el detalle de su pedido y metodos de pago.</p>
        <form  id="formCompra">
          <div class="g-4">
            <div class="row p-1">
              <div class="col-sm-10 col-lg-5 col-xl-6 ">
                <input type="nombre" class="form-control frm" placeholder="Nombre" id="nombre">
              </div>
            </div>
            <div class="row p-1">
              <div class="col-sm-10 col-lg-5 col-xl-6">
                <input type="email" class="form-control" placeholder="nombre@ejemplo.com" id="email">
              </div>
            </div>
            <div class="row p-1">
              <div class="col-1">
                <button type="button" class="btn btn-success" onclick="enviarCarrito()">Enviar</button>
              </div>
            </div>
          </div>
        </form>  
      </div>
    
    </div>
    `;
  // Elimino boton de finalizar compra porque y doy posibilidad de seguir comprando
  botonesFinalCompra.innerHTML = `
      <button type="button" class="btn btn-outline-secondary btn-sm" data-bs-dismiss="modal" onclick="limpiarCuenta()">Seguir Comprando</button>
      <button type="button" class="btn btn-outline-danger btn-sm" onclick="vaciarCarrito()" >Limpiar Carrito</button>     
  `;
  }else {
    // aviso de carrito vacio
    valorFinalCompra.innerHTML = `
    <div class="container p-4">
      <div class="alert alert-success p-1" role="alert">
        <h4 class="alert-heading">No agrego ningun producto</h4>
        <p>Vuelva a la pagina principal y seleccione que producto desea comprar</p>  
        <hr>
        <p class="mb-0 small">Carrito de Compras JS 1.1</p>
      </div>
    </div>
    `;
  botonesFinalCompra.innerHTML = `
    <div id="botonesFinalCompra">
    <button type="button" class="btn btn-success btn-sm" data-bs-dismiss="modal" onclick="limpiarCuentaModal()" >Seguir Comprando</button>   
    </div>
    `;
  }
}

// Funciones para eliminar el modal que muestra la cuenta del total cuando el usuario prefiere seguir comprando, 
// asi no tengo que agregar un boton de actualizar carrito, tambien actualizo listado de botones
function limpiarCuenta(){
  valorFinalCompra.innerHTML = `
  <div class="container p-4">
  </div>
  `;
  botonesFinalCompra.innerHTML = `
    <button type="button" class="btn btn-success btn-sm" data-bs-dismiss="modal">Seguir Comprando</button>
    <button type="button" class="btn btn-danger btn-sm" onclick="vaciarCarrito()" >Limpiar Carrito</button>
    <button type="button" class="btn btn-primary btn-sm" onclick="finalizarCarrito()">Finalizar Compra</button>
  `;
}
function limpiarCuentaModal(){
  modalPago.innerHTML = `
<div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-4" id="modalFinal">Carrito de Compras</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <h2>Resumen de Compra</h2>
          <div class="container">
          <!-- Visualizador de Productos--> 
            <div class="list-group" id="itemsCompra">
            </div>
          </div>
          <!-- Visualizador de Total-->
          <div id="valorFinalCompra"></div>
          <!-- Botones actualizables Cerrar Finalizar Borrar-->
          <div id="botonesFinalCompra">
          <button type="button" class="btn btn-success btn-sm" data-bs-dismiss="modal">Seguir Comprando</button>
          <button type="button" class="btn btn-danger btn-sm" onclick="vaciarCarrito()" >Limpiar Carrito</button>
          <button type="button" class="btn btn-primary btn-sm" onclick="finalizarCarrito()">Finalizar Compra</button>
          </div>
        </div>
      </div>
    </div>
    `;
}

// Mensaje de agradecimento
function enviarCarrito(){
  modalPago.innerHTML = `
  <div class="container p-4 text-center">
    <div class="alert alert-success p-1" role="alert">
      <h4 class="alert-heading">Muchas gracias</h4>
      <p>Vuela Pronto</p>  
      <button type="button" class="btn btn-success btn-sm" onclick="vaciarCarrito()">Volver a comprar</button>
    </div>
  </div>
  `;
}
  
// Testeo
const app = ()=>{
  mostrarProductos();
  cargarCarritoDesdeLocalStorage();
}

//ejecuto app
app()











