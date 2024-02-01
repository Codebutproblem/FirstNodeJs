const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const filterStatusHelper = require("../../helpers/filter-status");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/create-tree");
module.exports.index = async (req, res) => {

    const filterStatus = filterStatusHelper(req.query);

    let find = {
        deleted: false
    };

    if (req.query.status) {
        find.status = req.query.status;
    }

    let searchObject = searchHelper(req.query);
    if (searchObject.regex) {
        find.title = searchObject.regex;
    }
    const totalItem = await Product.countDocuments(find);
    let paginationObject = paginationHelper(1, 4, req.query, totalItem);
    paginationObject.totalItem = totalItem;

    let sort = {};
    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue;
    }
    else{
        sort.position = "desc";
    }

    const products = await Product.find(find).limit(paginationObject.limitItem).skip(paginationObject.skip).sort(sort);
    res.render("admin/pages/product/index", {
        pageTitle: "Sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: searchObject.keyword,
        pagination: paginationObject
    });
}

module.exports.changeStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.params.status;
    try{
        await Product.updateOne({ _id: id }, { status: status });
        req.flash("success", "Cập nhật sản phẩm thành công");
    }
    catch(error){
        req.flash("error", "Cập nhật sản phẩm không thành công");
    }
    res.redirect("back");
}

module.exports.changeMulti = async (req, res) => {
    const listID = req.body.ids.split(" ");
    const type = req.body.type;
    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: listID } }, { status: "active" });
            req.flash("success", "Cập nhật sản phẩm thành công");
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: listID } }, { status: "inactive" });
            req.flash("success", "Cập nhật sản phẩm thành công");
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: listID } }, { deleted: true, deleteAt: new Date() });
            req.flash("success", "Xóa sản phẩm thành công");
            break;
        case "change-position":
            for (const item of listID) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({ _id: id }, { position: position });
            }
            req.flash("success", "Thay đổi vị trí sản phẩm thành công");
            break;
        default:
            break;

    }

    res.redirect("back");
}

module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    try{
        await Product.updateOne({ _id: id }, { deleted: true, deleteAt: new Date() });
        req.flash("success","Xóa sản phẩm thành công");
    }
    catch(error){
        req.flash("error","Xóa sản phẩm không thành công");
    }
    res.redirect("back");
}

module.exports.create = async (req, res) => {

    let find = {
        deleted: false
    };
    const category = await ProductCategory.find(find);
    const newCategory = createTreeHelper.create(category);

    res.render("admin/pages/product/create", {
        pageTitle: "Tạo sản phẩm",
        category: newCategory
    });
}

module.exports.createProduct = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if (req.body.position == "") {
        const countProducts = await Product.countDocuments({});
        req.body.position = countProducts + 1;
    }
    else {
        req.body.position = parseInt(req.body.position);
    }
    try{ 
        await Product.create(req.body);
        req.flash("success", "Tạo sản phẩm thành công");
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
    catch(error){
        req.flash("error","Tạo mới sản phẩm thất bại");
        res.redirect("back");
    }
}

module.exports.edit = async (req, res) => {
    try{
        const id = req.params.id;
        const product = await Product.findOne({ _id: id, deleted: false});
        let find = {
            deleted: false
        };
        const category = await ProductCategory.find(find);
        const newCategory = createTreeHelper.create(category);
        res.render("admin/pages/product/edit", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product,
            category: newCategory
        });
    }
    catch(error){
        req.send("error","Sản phẩm không tồn tại");
        res.redirect("back");
    }
}

module.exports.editProduct = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);
    try{
        await Product.updateOne({ _id: req.params.id},req.body);
        req.flash("success", "Cập nhật sản phẩm thành công");
    }
    catch(error){
        req.flash("error", "Cập nhật sản phẩm không thành công");
    }
    res.redirect(`${systemConfig.prefixAdmin}/products`);
}