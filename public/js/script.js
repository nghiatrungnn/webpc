document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/products')
        .then(response => response.json())
        .then(products => {
            const productList = document.querySelector('.product-list');
            productList.innerHTML = ''; // Xóa nội dung cũ

            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');
                productCard.innerHTML = `
                    <h3><a href="/product/${product._id}">${product.name}</a></h3>
                    <p>Giá: ${product.price} VNĐ</p>
                    <form action="/cart/add" method="POST">
                        <input type="hidden" name="productId" value="${product._id}">
                        <button type="submit">Thêm vào giỏ</button>
                    </form>
                `;
                productList.appendChild(productCard);
            });
        })
        .catch(error => console.error('Lỗi khi lấy sản phẩm:', error));
});
