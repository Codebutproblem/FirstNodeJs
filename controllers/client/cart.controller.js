const Cart = require("../../models/cart.model");
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
    cart.totalPrice = cart.products.reduce((sum,product) => sum + product.totalPrice  ,0);
    res.render("client/pages/cart/index", {
        pageTitle: "Giỏ hàng",
        cartDetail: cart
    });
}

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
    res.redirect("/");
}

module.exports.delete = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    
    try{
       await Cart.updateOne({_id: cartId},{
            $pull:{
                products:{product_id: productId}
            }
        });
        req.flash("success","Xóa thành công");
    }
    catch(error){
        req.flash("error","Lỗi :((");
    }
    res.redirect("back");
}

module.exports.updateQuantity = async (req, res) => {
    const quantity = parseInt(req.params.quantity);
    const productId = req.params.productId;
    const cartId = req.cookies.cartId;
    await Cart.updateOne({
            _id: cartId, 
            "products.product_id": productId
        },{
        $set:{
            "products.$.quantity": quantity
        }
    });
    res.redirect("back");
}

