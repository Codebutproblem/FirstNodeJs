const Product =  require("../../models/product.model");
const Search = require("../../helpers/search");
module.exports.index = async (req, res) =>{
    
    const searchObject = Search(req.query);
    let displayProducts = [];   
    if(searchObject.regex){
        const products = await Product.find({
            deleted: false,
            status: "active",
            title: searchObject.regex
        });
        displayProducts = products.map(item =>{
            item.newPrice = Math.round(item.price*(1-(item.discountPercentage/100)));
            return item;
        });
    }
    res.render("client/pages/search/index",{
        pageTitle: "Tìm kiếm sản phẩm",
        keyword: searchObject.keyword,
        products: displayProducts
    });
}