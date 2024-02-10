const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const md5 = require("md5");
module.exports.index = async (req,res) => {
    let find = {
        deleted: false
    };
    const records = await Account.find(find).select("-password -token");
    for(const record of records){
        const role = await Role.findOne({_id: record.role_id, deleted: false});
        record.role = role;
    }
    res.render("admin/pages/account/index",{
        pageTitle: "Danh sách tài khoản",
        records: records
    });
}
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    };
    const roles = await Role.find(find);
    res.render("admin/pages/account/create",{
        pageTitle: "Tạo mới tài khoản",
        roles: roles
    })
}
module.exports.createPost = async (req, res) => {
    
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false
    });
    if(emailExist){
        req.flash("error","Email đã tồn tại");
    }
    else{
        req.body.password = md5(req.body.password);
        try{
            await Account.create(req.body);
            req.flash("success","Tạo mới tài khoản thành công");
        }
        catch(error){
            req.flash("error","Tạo mới tài khoản không thành công");
        }
    }
    res.redirect("back");
}

module.exports.edit = async (req, res) => {
    const id = req.params.id;
    const data = await Account.findOne({_id: id, deleted: false});
    const roles = await Role.find({deleted: false});
    res.render("admin/pages/account/edit",{
        pageTitle: "Cập nhật tài khoản",
        data: data,
        roles: roles
    });
}

module.exports.editPatch = async (req,res) =>{
    const id = req.params.id;
    const emailExist = await Account.findOne({
        _id: { $ne: id},
        email: req.body.email,
        deleted: false
    });
    if(emailExist){
        req.flash("error","Email đã tồn tại");
    }
    else{
        if(req.body.password){
            req.body.password = md5(req.body.password);
        }
        else{
            delete req.body.password;
        }
        await Account.updateOne({_id: id},req.body);
        req.flash("success","Cập nhật tài khoản thành công");
    }
    res.redirect("back");
    
}

module.exports.delete = async (req,res) =>{
    const id = req.params.id;
    try{
        await Account.updateOne({_id: id},{deleted: true, deleteAt: new Date()});
        req.flash("success","Xóa thành công");
    }
    catch(error){
        req.flash("Xóa thất bại");
    }
    res.redirect("back");
}