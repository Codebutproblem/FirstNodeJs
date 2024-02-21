const Cart = require("../../models/cart.model");
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({
        _id: cartId
    });
    for(const product of cart.products){
        const productInfo = await Product.findOne({
            _id: product.product_id
        });
        productInfo.newPrice = Math.round(productInfo.price*(1-(productInfo.discountPercentage/100)));
        product.totalPrice = product.quantity * productInfo.newPrice;
        product.productInfo = productInfo;
    }
    cart.totalPrice = cart.products.reduce((sum,product) => sum + product.totalPrice,0);
    res.render("client/pages/checkout/index", {
        pageTitle: "Thanh toán",
        cartDetail: cart
    });
}

module.exports.order = async (req, res) => {
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({
        _id: cartId
    });
    const userInfo = req.body;
    const products = [];
    for(const product of cart.products){
        const productInfo = await Product.findOne({
            _id: product.product_id
        });
        const productObject = {
            product_id: productInfo.id,
            price: productInfo.price,
            discountPercentage: productInfo.discountPercentage,
            quantity: product.quantity
        };
        products.push(productObject);

        const newStock = productInfo.stock - product.quantity;
        await Product.updateOne({_id: product.product_id},{
            stock: newStock
        });
    }
    const order = new Order({
        cart_id: cartId,
        userInfo: userInfo,
        products: products
    });
    await order.save();
    await Cart.updateOne({_id: cartId},{
        products: []
    });
    res.redirect(`/checkout/success/${order.id}`);
}

module.exports.success = async (req, res) => {
    res.render("client/pages/checkout/success",{
        pageTitle: "Thanh toán thành công"
    });
}