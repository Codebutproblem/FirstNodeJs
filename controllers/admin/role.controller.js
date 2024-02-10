const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
module.exports.index = async (req, res) => {

    let find = {
        deleted: false
    };
    const listData = await Role.find(find);

    res.render("admin/pages/role/index", {
        pageTitle: "Phân quyền",
        listData: listData
    });
}

module.exports.create = async (req, res) => {
    res.render("admin/pages/role/create", {
        pageTitle: "Tạo mới phần quyền"
    });
}

module.exports.createPost = async (req, res) => {
    try {
        await Role.create(req.body);
        req.flash("success", "Tạo mới thành công");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
    catch (error) {
        req.flash("error", "Tạo mới thất bại");
        res.redirect("back");
    }
}

module.exports.deleteItem = async (req, res) => {
    try {
        await Role.updateOne({ _id: req.params.id }, { deleted: true, deleteAt: new Date() });
        req.flash("success", "Xóa thành công");
    }
    catch (error) {
        req.flash("error", "Xóa không thành công");
    }
    res.redirect("back");
}

module.exports.edit = async (req, res) => {

    const data = await Role.findOne({ _id: req.params.id });
    res.render("admin/pages/role/edit", {
        pageTitle: "Sửa quyền",
        data: data
    });
}

module.exports.editPatch = async (req, res) => {

    try {
        await Role.updateOne({ _id: req.params.id }, req.body);
        req.flash("success", "Chỉnh sửa thành công");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
    catch (error) {
        req.flash("error", "Chỉnh sửa thất bại");
        res.redirect("back");
    }
}

module.exports.permission = async (req, res) => {

    let find = {
        deleted: false
    };    
    const records = await Role.find(find);
    res.render("admin/pages/role/permission",{
        pageTitle: "Phân quyền",
        records: records
    });
}

module.exports.permissionPatch = async (req,res) => {

    try{
        const permissions = JSON.parse(req.body.permissions);
        console.log(permissions);
        for(const item of permissions){
            await Role.updateOne({_id: item.id},{permissions: item.permissions});
        }
        req.flash("success","Cập nhật phân quyền thành công");
    }
    catch(error){
        req.flash("error","Cập nhật phân quyền không thành công");
    }
    res.redirect("back");
}