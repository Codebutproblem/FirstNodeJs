const Product =  require("../../models/product.model");

module.exports.index = async (req,res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({ position: "desc" });
    products.forEach(item =>{
        item.newPrice = Math.round(item.price*(1-(item.discountPercentage/100)));
    })
    res.render("client/pages/products/index",{
        pageTitle: "Sản phẩm",
        products: products
    });
}

module.exports.productDetail = async(req,res)=>{
    try{
        const find = {
            deleted: false,
            slug: req.params.slug,
            status: "active"
        };
        const product = await Product.findOne(find);
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