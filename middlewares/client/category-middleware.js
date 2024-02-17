const createTreeHelper = require("../../helpers/create-tree");
const productCategory = require("../../models/product-category.model");
module.exports.category = async (req,res,next) => {
    const categories = await productCategory.find({deleted: false});
    const categoryTree = createTreeHelper.create(categories);
    res.locals.categories = categoryTree;
    next();
}