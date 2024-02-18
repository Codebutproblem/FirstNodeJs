const Cart = require("../../models/cart.model");

module.exports.cartAdd = async (req, res) => {
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId
    });

    const productInCart = cart.products.find(item => item.product_id == productId);
    
    if (productInCart){

        const newQuantity = productInCart.quantity + quantity;
        await Cart.updateOne({
            _id: cartId, 
            "products.product_id": productId
        },{
            $set: {
                "products.$.quantity": newQuantity
            }
        });
    }
    else{
        await Cart.updateOne({_id: cartId},{
            $push: {products: {
                product_id: productId,
                quantity: quantity
            }}
        });
    }
    req.flash("success","Thêm vào giỏ hàng thành công");
    res.redirect("back");
}