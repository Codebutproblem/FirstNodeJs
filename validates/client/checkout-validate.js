const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
module.exports.quantityCheck = async (req, res, next) => {
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({
        _id: cartId
    });
    for(const product of cart.products){
        const productInfo = await Product.findOne({
            _id: product.product_id
        });
        if(product.quantity > productInfo.stock){
            req.flash("error"," Không đủ hàng đâu, đừng cố chấp");
            res.redirect("back");
            return;
        }
    }
    next();
}