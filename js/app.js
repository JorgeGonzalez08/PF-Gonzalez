import updateCart from "./cart.js"
const URL = "./data/products.json";

fetch(URL)
    .then(response => response.json())
    .then(json => showJson(json))
    .catch(error => console.error('Error al cargar el JSON:', error));

function showJson(data) {
    const cards = document.querySelector(".main__cards");

    const selectBrand = document.querySelector("#brand");
    const selectSort = document.querySelector("#sort");

    /*======= Funcion para filtrar por marca =======*/
    function filterAndSortProducts() {

        let filterProduct = data;

        /*======= Filtrar  =======*/
        if (selectBrand.value !== "all") {
            filterProduct = filterProduct.filter(product => product.marca === selectBrand.value);
        }

        /*======= Ordenar por precio(< a > o > a <) =======*/
        filterProduct = filterProduct.sort((a, b) => {
            const priceA = Math.min(...a.price);
            const priceB = Math.min(...b.price);

            return selectSort.value === "low" ? priceA - priceB : priceB - priceA;
        });
        showProducts(filterProduct);

    }
    selectBrand.addEventListener("change", filterAndSortProducts);
    selectSort.addEventListener("change", filterAndSortProducts);

    /*======= Funcion para mostrar los productos =======*/
    function showProducts(products) {
        cards.innerHTML = "";
        products.forEach(item => {


            let maxPrice = item.price.length - 1;
            const card = document.createElement("div");
            card.className = "main__card"
            card.innerHTML = `
                <img src="${item.images[0]}" alt="${item.title}">
                <p class="main__card-title">${item.title}</p>
                <p class="main__card-price">${item.price[0]} - ${item.price[maxPrice]}</p>
                <p>⭐${item.rating}</p>
                <a class="main__card-link" href="./product.html?id=${item.id}">VER PRODUCTO</a>
            `;
            cards.append(card);
        });

    }
    showProducts(data);

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

