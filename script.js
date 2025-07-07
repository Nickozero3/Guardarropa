const password = "311822";
let confirmado = false;
let totalEnCaja = 0;

let productos = [
  { nombre: "Entrada VIP", stock: 40, precio: 5000, vendidos: 0 },
  {
    nombre: "Combo Botella Vodka Sernova + 3 speeds",
    stock: 20,
    precio: 38000,
    vendidos: 0,
  },
  {
    nombre: "Combo Botella Vodka Absolut + 3 speeds",
    stock: 20,
    precio: 84000,
    vendidos: 0,
  },
  {
    nombre: "Combo Botella Gin + tonica ",
    stock: 20,
    precio: 84000,
    vendidos: 0,
  },
];

function guardarEstado() {
  localStorage.setItem(
    "ventasStock",
    JSON.stringify({
      productos,
      totalEnCaja,
    })
  );
}

function cargarEstado() {
  const datos = JSON.parse(localStorage.getItem("ventasStock"));
  if (datos) {
    productos = datos.productos;
    totalEnCaja = datos.totalEnCaja || 0;
  }
}

function generarTabla() {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";
  productos.forEach((prod, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
    <td class="nombre">${prod.nombre}</td>
    <td><input type="number" value="${prod.stock}" class="stockBase"></td>
    <td><input type="number" value="${prod.precio}" class="price"></td>
    <td><button class="restar" onclick="restarStock(this, ${index})">+1 Vendido</button></td>
    <td class="actualStock">${prod.stock - prod.vendidos}</td>
    <td class="totalVendido">$${prod.vendidos * prod.precio}</td>
  `;
    tbody.appendChild(tr);
  });
  actualizarResumen();
}

function confirmPassword() {
  const input = document.getElementById("passwordInput").value;
  if (input === password) {
    confirmado = true;
    bloquearEdicion();
    document.getElementById("passwordSection").innerHTML =
      "<strong>Stock confirmado.</strong>";
  } else {
    alert("Contraseña incorrecta");
  }
}

function bloquearEdicion() {
  const filas = document.querySelectorAll("#tableBody tr");
  filas.forEach((fila, index) => {
    const stockInput = fila.querySelector(".stockBase");
    const precioInput = fila.querySelector(".price");
    const actualStock = fila.querySelector(".actualStock");

    if (stockInput.value === "" || precioInput.value === "") {
      alert(
        "Completá stock y precio en todos los productos antes de confirmar."
      );
      confirmado = false;
      return;
    }

    productos[index].stock = parseInt(stockInput.value);
    productos[index].precio = parseFloat(precioInput.value);
    actualStock.innerText = productos[index].stock - productos[index].vendidos;

    stockInput.disabled = true;
    precioInput.disabled = true;
  });

  guardarEstado();
}

function restarStock(btn, index) {
  if (!confirmado) {
    alert("Confirmá el stock con la contraseña primero");
    return;
  }

  const fila = btn.parentElement.parentElement;
  const actual = fila.querySelector(".actualStock");

  let stockDisponible = productos[index].stock - productos[index].vendidos;

  if (stockDisponible > 0) {
    productos[index].vendidos += 1;
    stockDisponible--;

    actual.innerText = stockDisponible;
    const vendidos = fila.querySelector(".totalVendido");
    vendidos.innerText =
      "$" + productos[index].vendidos * productos[index].precio;

    totalEnCaja += productos[index].precio;
    actualizarResumen();
    guardarEstado();
  } else {
    alert("¡Stock agotado!");
  }
}

function actualizarResumen() {
  document.getElementById("totalCaja").innerText = totalEnCaja;
  const lista = document.getElementById("listaVendidos");
  lista.innerHTML = "";
  productos.forEach((prod) => {
    if (prod.vendidos > 0) {
      const li = document.createElement("li");
      li.textContent = `${prod.nombre}: ${prod.vendidos} vendidos`;
      lista.appendChild(li);
    }
  });
}

function reiniciarVentas() {
  const clave = prompt("Ingresá la contraseña para reiniciar las ventas:");
  if (clave !== password) {
    alert("Contraseña incorrecta.");
    return;
  }

  productos.forEach((p) => (p.vendidos = 0));
  totalEnCaja = 0;
  generarTabla();
  guardarEstado();
  alert("Ventas reiniciadas correctamente.");
}

// Inicialización
cargarEstado();
generarTabla();
