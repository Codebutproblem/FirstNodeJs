const homeRouter = require("./home.route");
const productsRouter = require("./products.route");
const categoriesMiddleware = require("../../middlewares/client/category-middleware");
module.exports = (app) =>{
    app.use("/",categoriesMiddleware.category,homeRouter);    
    app.use("/products",categoriesMiddleware.category,productsRouter);
}