import logger from "../../helpers/logger.helper.js";

async function addToCart(cid, pid, quantity) {
    try {
        const response = await fetch(`/api/carts/${cid}/products/${pid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId: pid, quantity: quantity })
        });

        if (!response.ok) {
            throw new Error('Error al agregar al carrito');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        logger.ERROR("Error al agregar al carrito:", error);
        throw error;
    }
}
const cid = document.querySelector("#dataCart").getAttribute("data-cart-id");
const buttons = document.querySelectorAll(".btn");
buttons.forEach(button => {
    button.addEventListener("click", function () {
        const pid = this.getAttribute('data-product-id');
        const quantityInput = document.getElementById(`quantity-${pid}`);
        const quantity = parseInt(quantityInput.value);
        const title = this.closest('.card').querySelector('h3').innerText;

        addToCart(cid, pid, quantity)
            .then(() => {
                Swal.fire({
                    position: 'top-end', 
                    icon: 'success',       
                    title: `Producto "${title}" agregado al carrito.`,
                    showConfirmButton: false,
                    timer: 2000,
                    toast: true,
                    iconColor: '#fea',
                    background: 'black',
                    color: "white",
                    customClass: {
                        title: 'custom-title'
                    }
                });
            })
            .catch(error => {
                logger.ERROR("Error al agregar el producto al carrito", error);
            });
    });
});
