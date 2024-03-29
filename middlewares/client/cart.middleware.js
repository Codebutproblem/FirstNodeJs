const Cart = require("../../models/cart.model");
module.exports.cartId = async (req, res, next) => {
    if (!req.cookies.cartId) {
        const cart = new Cart();
        await cart.save();

        const timeExist = 365 * 24 * 60 * 60 * 1000;
        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + timeExist)
        })
        res.locals.cart = cart;
    }
    else{
        const cart = await Cart.findOne({
            _id: req.cookies.cartId
        });
        
        cart.totalProducts = cart.products.reduce((sum,product) => sum + product.quantity, 0);
        res.locals.cart = cart;
    }
    next();
}