const dashboardRoutes = require("./dashboard.route");
const productsRoutes = require("./product.route");
const productCategoryRoutes = require("./product-category.route");
const roleRoutes = require("./role.route");
const systemConfig = require("../../config/system");
module.exports = (app) =>{
    app.use(systemConfig.prefixAdmin + "/dashboard",dashboardRoutes);
    app.use(systemConfig.prefixAdmin + "/products", productsRoutes);
    app.use(systemConfig.prefixAdmin + "/products-category", productCategoryRoutes);
    app.use(systemConfig.prefixAdmin + "/roles", roleRoutes);
}