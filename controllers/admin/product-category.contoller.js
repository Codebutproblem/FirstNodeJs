const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/create-tree");
module.exports.index = async (req,res)=>{
    let find = {
        deleted: false
    };
    
    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper.create(records);
    res.render("admin/pages/product-category/index",{
        pageTitle: "Danh mục sản phẩm",
        records: newRecords
    });
}
module.exports.create = async (req,res) => {

    let find = {
        deleted: false
    };
    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper.create(records);

    res.render("admin/pages/product-category/create",{
        pageTitle: "Tạo danh mục",
        records: newRecords
    });
}

module.exports.createPost = async(req,res) =>{

    if (req.body.position == "") {
        const count = await ProductCategory.countDocuments({});
        req.body.position = count + 1;
    }
    else {
        req.body.position = parseInt(req.body.position);
    }
    try{ 
        await ProductCategory.create(req.body);
        req.flash("success", "Tạo danh mục thành công");
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
    catch(error){
        req.flash("error","Tạo danh mục thất bại");
        res.redirect("back");
    }
}

module.exports.edit = async (req,res) => {

    const records = await ProductCategory.find({deleted: false});
    const newRecords = createTreeHelper.create(records);
    let find = {
        deleted: false,
        _id: req.params.id
    };
    const data = await ProductCategory.findOne(find);

    res.render("admin/pages/product-category/edit",{
        pageTitle: "Tạo danh mục",
        records: newRecords,
        data:data
    });
}

module.exports.editPatch = async (req,res) => {
    try{
        req.body.positon = parseInt(req.body.positon);

        await ProductCategory.updateOne({_id: req.params.id},req.body);
        req.flash("success","Cập nhật thành công");
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
    catch(error){
        req.flash("error","Cập nhật thất bại");
        res.redirect("back");
    }
}

module.exports.deleteItem = async (req, res) =>{
    try{
        await ProductCategory.updateOne({_id : req.params.id},{deleted: true, deleteAt: new Date()});
        req.flash("success","Xóa thành công");
    }
    catch(error){
        req.flash("error","Xóa không thành công");
    }   
    res.redirect("back");
}

module.exports.changeStatus = async (req, res) => {
    try{
        const status = req.params.status;
        const id = req.params.id;
        await ProductCategory.updateOne({_id:id},{status: status});
        req.flash("success","Cập nhật trạng thái thành công");
    }
    catch(error){
        req.flash("error","Cập nhật trạng thái không thành công");
    }
    res.redirect("back");
}
