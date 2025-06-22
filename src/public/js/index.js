const socket = io();

let title = document.getElementById('title');
let description = document.getElementById('desc');
let code = document.getElementById('code');
let price = document.getElementById('price');
let stock = document.getElementById('stock');
let category = document.getElementById('category');
let btn = document.getElementById('submit');


btn.addEventListener('click', () => {
    if (!title.value || !description.value || !code.value || !price.value || !stock.value || !category.value) {
        return alert('Todos los campos son obligatorios');
    }
    if (isNaN(price.value) || isNaN(stock.value)) {
        return alert('El precio y el stock deben ser números');
    }
    if (price.value <= 0 || stock.value <= 0) {
        return alert('El precio y el stock deben ser mayores a 0');
    }
    let product = {
        title: title.value,
        description: description.value,
        code: code.value,
        price: parseInt(price.value),
        stock: parseInt(stock.value),
        category: category.value
    }
    socket.emit('newProduct', product);
    title.value = '';
    description.value = '';
    code.value = '';
    price.value = '';
    stock.value = '';
    category.value = '';
});

socket.on('updateProducts', (products) => {
    const productList = document.querySelector('.products');
    productList.innerHTML = '';
    products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
            <h3 class="product__title" id="titleProduct">${product.title}</h3>
            <p>Descripción: ${product.description}</p>
            <p>Código: ${product.code}</p>
            <p>Precio: $${product.price}</p>
            <p>Stock: ${product.stock}</p>
            <p>Categoria: ${product.category}</p>
            <button class="product__delete" id="delete" onclick="deleteProduct('${product.code}')">Eliminar</button>
        `;
        productList.appendChild(div);
    });
});

function deleteProduct(code) {
    socket.emit('deleteProduct', code);
}

socket.on('error', (error) => {
    alert(error);
});