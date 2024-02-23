module.exports.checkRegister = (req,res,next)=>{
    if(!req.body.fullName){
        req.flash("error","Chưa điền tên");
        res.redirect("back");
        return;
    }
    if(!req.body.email){
        req.flash("error","Chưa điền Email");
        res.redirect("back");
        return;
    }
    if(!req.body.password){
        req.flash("error","Chưa điền mật khẩu");
        res.redirect("back");
        return;
    }
    next();
}
module.exports.checkLogin = (req,res,next)=>{
    if(!req.body.email){
        req.flash("error","Chưa điền Email");
        res.redirect("back");
        return;
    }
    if(!req.body.password){
        req.flash("error","Chưa điền mật khẩu");
        res.redirect("back");
        return;
    }
    next();
}