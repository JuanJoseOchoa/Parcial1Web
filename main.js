const url =
  "https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json";

fetch(url)
  .then((res) => res.json())
  .then((res) => {
    carga = res;
    cardCarousel("Burguers")  
  });

let canasta = new Map();

function agregarProducto(n) {
  document.getElementById("cantidad").innerHTML = n + " Items";
}

function generarFactura(){
  let producto = {item: 0, quantity: 0, description: "", unitPrice: 0}
  let contador=1
  
  canasta.forEach((values,keys)=>{
    producto.item = contador
    producto.quantity = values
    producto.description = keys.name
    producto.unitPrice = keys.price
    contador++
    console.log(producto) 
  })
}

function cardCarousel(item) {

  document.getElementById("menu").innerHTML = "";
  let menu = document.createElement("h1");
  menu.className = "text-center";
  menu.appendChild(document.createTextNode(item));
  document.getElementById("menu").appendChild(menu);
  document.getElementById("menu").appendChild(document.createElement("hr"));

  carga.forEach((index) => {
    if (index.name == item) {

      index.products.forEach((plato) => {
        
        let columna = document.createElement("div");
        columna.className = "col-3"

        let carta = document.createElement("div");
        carta.className = "card";
        carta.style = "margin-bottom: 30px;"
        carta.id = "carta";

        let flex = document.createElement("div");
        flex.className = "card-body d-flex flex-column";

        let foto = document.createElement("img");
        foto.className = "card-img-top";
        foto.style = "height: 12rem;";
        foto.id = "imagen";
        foto.src = plato.image;

        let cuerpo = document.createElement("div");
        cuerpo.className = "card-body d-flex flex-column";

        let nombre = document.createElement("h5");
        nombre.className = "card-title";
        nombre.appendChild(document.createTextNode(plato.name));

        let descripcion = document.createElement("p");
        descripcion.className = "card-text";

        let valor = document.createElement("h5");
        valor.className = "mt-auto card-title";
        valor.id = "precio";

        let agregar = document.createElement("a");
        agregar.className = "mt-auto btn btn-dark";
        
        descripcion.appendChild(document.createTextNode(plato.description));
        valor.appendChild(document.createTextNode("$"+plato.price));
        agregar.appendChild(document.createTextNode("Add to cart"));
        cuerpo.appendChild(nombre);
        cuerpo.appendChild(descripcion);
        cuerpo.appendChild(valor);
        cuerpo.appendChild(agregar);
        flex.appendChild(foto);
        flex.appendChild(cuerpo);
        carta.appendChild(flex);
        columna.appendChild(carta);
        document.getElementById("menu").appendChild(columna);

        agregar.addEventListener("click", function (event) {
          event.preventDefault();
          if (canasta.get(plato) == undefined) {
            canasta.set(plato, 1);
          } else {
            canasta.set(plato, canasta.get(plato) + 1);
          }
          let sum = 0;
          canasta.forEach((v) => {
            sum += v;
          });
          agregarProducto(sum);
        });
      });
    }
  });
}

function cargarPedido(){
  document.getElementById("menu").innerHTML = "";
  let menu = document.createElement("h1");
  menu.className = 'text-center';
  menu.appendChild(document.createTextNode("Order Detail"));
  document.getElementById("menu").appendChild(menu);
  document.getElementById("menu").appendChild(document.createElement("hr"));

  let main = document.createElement("table");
  main.className = 'table table-striped';

  let cabeza = document.createElement("thead");

  let cuerpo = document.createElement("tbody");

  let columnas = document.createElement("tr");

  let plato = document.createElement("th");
  plato.innerText = 'Item';

  let cantidad = document.createElement("th");
  cantidad.innerText = 'Qty.';

  let descripcion = document.createElement("th");
  descripcion.innerText = 'Description';

  let precio = document.createElement("th");
  precio.innerText = 'Unit Price';

  let sumatoria = document.createElement("th");
  sumatoria.innerText = 'Amount';

  let cambios = document.createElement("th");
  cambios.innerText = 'Modify';

  columnas.appendChild(plato);
  columnas.appendChild(cantidad);
  columnas.appendChild(descripcion);
  columnas.appendChild(precio);
  columnas.appendChild(sumatoria);
  columnas.appendChild(cambios);
  cabeza.appendChild(columnas);
  main.appendChild(cabeza);
  
  let x = 1;
  let finalTotal = 0;
  
  canasta.forEach((values,keys) => {
    let elemento = document.createElement('tr');

    plato = document.createElement("th");
    plato.innerText = x;

    cantidad = document.createElement('td');
    cantidad.innerText = values;

    descripcion = document.createElement('td');
    descripcion.innerText = keys.name;

    precio = document.createElement('td');
    precio.innerText = keys.price;

    sumatoria = document.createElement('td');
    sumatoria.innerText = (keys.price*values).toFixed(2);

    finalTotal=finalTotal+(keys.price*values);

    botones = document.createElement('td');

    let restar = document.createElement('a');
    restar.className = 'btn btn-dark';
    restar.innerText = '-';
    restar.id = "botonRestar";

    let sumar = document.createElement('a');
    sumar.className = 'btn btn-dark';
    sumar.innerText = '+';
    sumar.id = "botonSumar";
    
    sumar.addEventListener("click", function (event) {
      event.preventDefault();
      canasta.set(keys, canasta.get(keys)+1);
      let sum = 0;
      canasta.forEach((v) => {
            sum += v;
          });
      agregarProducto(sum);
      cargarPedido();
    });

    restar.addEventListener("click", function (event) {
      event.preventDefault();
      if(canasta.get(keys)==1) {
        canasta.delete(keys);
      }
      else{
        canasta.set(keys, canasta.get(keys)-1);
      } 
      let sum = 0;
      canasta.forEach((v) => {
            sum += v;
          });
      agregarProducto(sum);
      cargarPedido();
    });
    
    botones.appendChild(restar);
    botones.appendChild(sumar);
    elemento.appendChild(plato);
    elemento.appendChild(cantidad);
    elemento.appendChild(descripcion);
    elemento.appendChild(precio);
    elemento.appendChild(sumatoria);
    elemento.appendChild(botones);
    cuerpo.appendChild(elemento);
  })

  main.appendChild(cuerpo);
  document.getElementById("menu").appendChild(main);

  let footer = document.createElement('div');
  footer.className='container';

  let row = document.createElement('div');
  row.className='row';

  let total = document.createElement('div');
  total.className='col totalCompra';
  total.innerText='Total: $'+finalTotal.toFixed(2);

  let botones2 = document.createElement('div');
  botones2.className='col';
  cancelar = document.createElement('button');
  cancelar.className = 'btn btn-danger';
  cancelar.innerText = 'Cancel';
  cancelar.style = "margin: 2px";
  cancelar.dataset.toggle = 'modal';
  cancelar.dataset.target = '#cancelarModal';

  confirmar = document.createElement('button');
  confirmar.className = 'btn btn-success';
  confirmar.innerText = 'Confirm order';
  confirmar.style = "margin: 2px";


  confirmar.addEventListener("click", function (event) {
    event.preventDefault();
    generarFactura();
    canasta = new Map();
    cargarPedido();
    agregarProducto(0);
  });

  botones2.appendChild(cancelar);
  botones2.appendChild(confirmar);
  row.appendChild(total);
  row.appendChild(botones2);
  footer.appendChild(row);
  document.getElementById("menu").appendChild(footer);
}


document.getElementById("burgers").addEventListener("click", function (event) {
  event.preventDefault();
  cardCarousel("Burguers");
});

document.getElementById("tacos").addEventListener("click", function (event) {
  event.preventDefault();
  cardCarousel("Tacos");
});

document.getElementById("salads").addEventListener("click", function (event) {
  event.preventDefault();
  cardCarousel("Salads");
});

document.getElementById("desserts").addEventListener("click", function (event) {
  event.preventDefault();
  cardCarousel("Desserts");
});

document.getElementById("drinks").addEventListener("click", function (event) {
  event.preventDefault();
  cardCarousel("Drinks and Sides");
});

document.getElementById("canasta").addEventListener("click", function (event) {
  event.preventDefault();
  cargarPedido();
});

document.getElementById("cancelacion").addEventListener("click", function (event) {
  event.preventDefault();
  canasta = new Map();
  cargarPedido();
  agregarProducto(0);
});



