const Product =  require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const childrenCategoryHelper = require("../../helpers/children-category");
module.exports.index = async (req,res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({ position: "desc" });
    products.forEach(item =>{
        item.newPrice = Math.round(item.price*(1-(item.discountPercentage/100)));
    });
    res.render("client/pages/products/index",{
        pageTitle: "Sản phẩm",
        products: products
    });
}

module.exports.productDetail = async(req,res)=>{
    const product = await Product.findOne({
        deleted: false,
        slug: req.params.slug,
        status: "active"
    });
    const category = await ProductCategory.findOne({
        deleted: false,
        status: "active",
        _id: product.parent_id
    })
    product.category = category;
    try{    
        res.render("client/pages/products/detail",{
            pageTitle: "Chi tiết sản phẩm",
            product: product
        });
    }
    catch(error){
        console.log(error);
        res.redirect("back");
    }
}

module.exports.category = async (req, res) => {

    const productCategory = await ProductCategory.findOne({
        deleted: false,
        status: "active",
        slug: req.params.slugCategory
    });
    const listProductCategory = await childrenCategoryHelper.getChildren(productCategory.id);
    const listProductCategoryId = listProductCategory.map(item => item.id);
    const products = await Product.find({
        status: "active",
        deleted: false,
        product_category_id:{ $in: [productCategory.id, ...listProductCategoryId]}
    }).sort({ position: "desc" });
    products.forEach(item =>{
        item.newPrice = Math.round(item.price*(1-(item.discountPercentage/100)));
    })
    res.render("client/pages/products/index",{
        pageTitle: "Sản phẩm",
        products: products
    });
}