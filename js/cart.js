let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addProduct(product, prices, color, storages, amount) {
    let itemAdd = cart.find((item) => item.product.title === product.title && item.color == color && item.storages == storages);

    if (itemAdd) {
        itemAdd.amount += amount;

    } else {
        cart.push({ product, prices, color, storages, amount });
    }
    updateCart();

}

/*======= Funcion para mostrar y actualizar el carrito =======*/
const cartProducts = document.querySelector(".main__cart-products");
const cartEmpty = document.querySelector(".main__cart-empty");
const cartFull = document.querySelector(".main__cart-full");
function updateCart() {
    if (cart.length === 0) {
        cartEmpty.style.display = "flex";
        cartFull.style.display = "none";
    } else {
        cartEmpty.style.display = "none";
        cartFull.style.display = "flex";
        cartProducts.innerHTML = ""
        cart.forEach((item) => {
            let transformPrice = item.prices.toString();
            let transformTotal = ((item.prices * item.amount).toFixed(3)).toString();
            const cartItem = document.createElement("div");
            cartItem.className = "main__cart-product";
            cartItem.innerHTML = `
        <img class="main__cart-img" src="${item.product.images[0]}" alt="img">
        <div class="main__cart-item">
            <p>${item.product.title}</p>
            <p>Color: ${item.color}</p>
            <p>Almacenamiento: ${item.storages}</p>
        </div>
        <p>$ ${transformPrice.replace(".", ",")}</p>
        <p>${item.amount}</p>
        <p>$ ${transformTotal.replace(".", ",")}</p>
        `;
            const deleteButton = document.createElement("button");
            deleteButton.className = "main__cart-delete";
            deleteButton.innerHTML = '<i class="fa-regular fa-trash-can fa-2xl"></i>';
            deleteButton.addEventListener("click", () => {
                deleteCart(item);
            });
            cartItem.append(deleteButton);
            cartProducts.append(cartItem);
        })
        const cartTotal = document.querySelector("#total");
        let total = cart.reduce((acc, prod) => acc + (prod.prices * prod.amount), 0);
        let transform = (total.toFixed(3)).toString();
        cartTotal.innerText = `$ ${transform.replace(".", ",")}`;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
}

function deleteCart(product) {
    let index = cart.findIndex((item) => item.id === product.product.id);
    cart.splice(index, 1);
    updateCart()
}
updateCart();

export default (updateCart, addProduct);