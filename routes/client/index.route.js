const homeRouter = require("./home.route");
const productsRouter = require("./products.route");
const searchRouter = require("./search.route");
const cartRouter = require("./cart.route");
const checkoutRoute = require("./checkout.route");
const userRoute = require("./user.route");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const userMiddleware = require("../../middlewares/client/user.middleware");
const categoriesMiddleware = require("../../middlewares/client/category-middleware");
const validate = require("../../validates/client/checkout-validate");
module.exports = (app) =>{
    app.use(categoriesMiddleware.category);
    app.use(cartMiddleware.cartId);
    app.use(userMiddleware.getUser)
    app.use("/",homeRouter);    
    app.use("/products",productsRouter);
    app.use("/search",searchRouter);
    app.use("/cart",cartRouter);
    app.use("/checkout",validate.quantityCheck,checkoutRoute);
    app.use("/user", userRoute);
}