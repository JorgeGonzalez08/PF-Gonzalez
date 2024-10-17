import addProduct from "./cart.js"

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

const URL = "./data/products.json";

fetch(URL)
    .then(response => response.json())
    .then(json => showJson(json))


const images = document.querySelector(".main__images");
const gallery = document.querySelector(".main__gallery");
const principalImage = document.createElement("img");

const title = document.querySelector(".main__desc-title");
const code = document.querySelector(".main__desc-code");
const price = document.querySelector(".main__desc-price");

function showJson(data) {
    let product = data.find((item) => item.id == productId);

    const breadcrumProduct = document.querySelector(".breadcrumb-product");
    breadcrumProduct.innerText = product.title;

    /*======= Carrusel de imagenes =======*/
    product.images.forEach(urlImage => {
        const galleryImage = document.createElement("img");
        galleryImage.className = "main__gallery-image";
        galleryImage.atl = product.title;
        galleryImage.src = urlImage;
        gallery.append(galleryImage);

        galleryImage.addEventListener("mouseover", () => {
            principalImage.src = urlImage;
        })

    });

    principalImage.className = "main__image";
    principalImage.alt = product.title;
    principalImage.src = product.images[0];
    images.append(principalImage)

    title.innerText = product.title;
    code.innerText = `Código de Producto: ${product.code}`;

    let lastPrice = product.price.length - 1;
    price.innerText = `$${product.price[0]} - $${product.price[lastPrice]}`;

    /*======= Crear y mostrar botones para el color =======*/
    const colors = document.querySelector(".main__desc-colors");
    const color = document.querySelector(".color");

    product.colors.forEach(selectColor => {
        const button = document.createElement("button");

        button.className = "main__desc-color"
        button.style.backgroundColor = selectColor;
        button.innerText = selectColor;
        button.style.color = selectColor;
        colors.append(button)

        button.addEventListener("click", () => {
            color.innerText = selectColor.toUpperCase();
        })
    });

    /*======= Crear y mostrar botones para el almacenamiento =======*/
    const storages = document.querySelector(".main__desc-storages");
    const storage = document.querySelector(".storage");
    let priceFinal = 0;
    product.storage.forEach(selectStorage => {
        const buttonStorage = document.createElement("button");
        buttonStorage.className = "main__desc-button";
        buttonStorage.innerHTML = selectStorage;
        storages.append(buttonStorage)

        buttonStorage.addEventListener("click", () => {
            let index = product.storage.indexOf(selectStorage)
            priceFinal = product.price[index];
            storage.innerText = selectStorage;
            price.innerText = `$${priceFinal}`;
        })

    });

    const containerButtons = document.querySelector(".main__desc-buttons");

    /*======= Boton para disminuir la cantidad =======*/
    const buttonLess = document.createElement("button");
    buttonLess.className = "main__desc-button";
    buttonLess.innerHTML = `<i class="fa-solid fa-minus"></i>`;

    /*======= Parrafo que contiene la cantidad =======*/
    const labelAmount = document.createElement("p");
    labelAmount.className = "main__desc-amount"
    labelAmount.innerText = "1";

    /*======= Boton para aumentar la cantidad =======*/
    const buttonPlus = document.createElement("button");
    buttonPlus.className = "main__desc-button";
    buttonPlus.innerHTML = `<i class="fa-solid fa-plus"></i>`;

    /*======= Eventos para disminuir y aumentar la cantidad =======*/
    let amount = 1;
    buttonLess.addEventListener("click", () => {
        if (amount > 1) {
            amount--;
            labelAmount.innerText = amount;
        }
    });
    buttonPlus.addEventListener("click", () => {
        amount++;
        labelAmount.innerText = amount;
    });

    /*======= Mostrar descripcion del producto =======*/
    const description = document.querySelector(".description");
    description.innerText = product.description;

    containerButtons.append(buttonLess);
    containerButtons.append(labelAmount);
    containerButtons.append(buttonPlus);

    /*======= Boton para agregar al carrito =======*/
    const buttonAdd = document.querySelector(".width");
    buttonAdd.addEventListener("click", () => {
        if (color.textContent == "" || storage.textContent == "") {
            Toastify({
                text: "Favor de seleccionar un color y almacenamiento",
                gravity: "top",
                style: {
                    background: "rgb(86, 0, 136)",
                },
                offset: {
                    x: 0, 
                    y:60 
                  },
                duration: 2000
            }).showToast();
        }
        else {
            addProduct(product, priceFinal, color.textContent, storage.textContent, parseInt(labelAmount.textContent))
            labelAmount.innerText = "1";
            storage.innerHTML="";
            color.innerHTML="";
            amount = 1;
            Toastify({
                text: `${product.title} agregado al carrito`,
                gravity: "top",
                style: {
                    background: "rgb(86, 0, 136)",
                },
                offset: {
                    x: 0, 
                    y:60 
                  },
                duration: 2000
            }).showToast();
        }
    })
}

/*======= Eventos para abrir y cerrar carrito =======*/
const closeButton = document.querySelector(".main__close-cart");
const openButton = document.querySelector(".header__open-cart");
const cartShop = document.querySelector(".main__cart-shop");
const mainSection = document.querySelector(".main__section");

mainSection.addEventListener("click", () => buttons());
closeButton.addEventListener("click", () => buttons());

function buttons() {
    mainSection.style.display = "none"
    cartShop.style.left = "100%"
    document.body.style.overflow = 'auto';
}

openButton.addEventListener("click", () => {
    mainSection.style.display = "block";
    cartShop.style.left = "50%"
    document.body.style.overflow = 'hidden';
})

