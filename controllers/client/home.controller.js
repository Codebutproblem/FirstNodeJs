const Product =  require("../../models/product.model");
module.exports.index = async (req, res)=>{
    const featuredProducts = await Product.find({
        status: "active",
        deleted: false,
        featured: "1"
    }).sort({ position: "desc" }).limit(6);

    const newProducts = await Product.find({
        deleted: false,
        status: "active",
    }).sort({ position: "desc" }).limit(6);
    
    featuredProducts.forEach(item =>{
        item.newPrice = Math.round(item.price*(1-(item.discountPercentage/100)));
    });
    newProducts.forEach(item =>{
        item.newPrice = Math.round(item.price*(1-(item.discountPercentage/100)));
    });
    res.render("client/pages/home/index",{
        pageTitle: "Trang chủ",
        featuredProducts: featuredProducts,
        newProducts: newProducts
    });
}