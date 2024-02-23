const User = require("../../models/user.model");
const Forgot = require("../../models/forgot.model");
const md5 = require("md5");
const generate = require("../../helpers/generate");
module.exports.register = (req, res) => {
    res.render("client/pages/user/register",{
        pageTitle: "Đăng ký tài khoản"
    });
}
module.exports.registerPost = async (req, res) => {
    
    const emailExist = await User.findOne({
        email: req.body.email,
        deleted: false
    });
    if(emailExist){
        req.flash("error","Email đã tồn tại");
        res.redirect("back");
        return;
    }

    req.body.password = md5(req.body.password);

    const user = await User(req.body);
    await user.save();

    res.cookie("tokenUser",user.tokenUser);
    res.redirect("/");
}

module.exports.login = async (req, res) => {
    res.render("client/pages/user/login",{
        pageTitle: "Đăng nhập tài khoản"
    });
}
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({
        email: email,
        deleted: false,
    });

    if(!user){
        req.flash("error","Không tồn tại tài khoản");
        res.redirect("back");
        return;
    }
    if(md5(password) != user.password){
        req.flash("error","Mật khẩu sai");
        res.redirect("back");
        return;
    }
    if(user.status == "inactive"){
        req.flash("error","Tài khoản chưa được kích hoạt");
        res.redirect("back");
        return;
    }
    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/");
}

module.exports.logout = async (req, res) =>{
    res.clearCookie("tokenUser");
    res.redirect("/");
}

module.exports.forgot = async (req, res) =>{
    res.render("client/pages/user/forgot",{
        pageTitle: "Quên mật khẩu"
    });
}
module.exports.forgotPost = async (req, res) => {
    const email = req.body.email;

    const user = await User.findOne({
        email: email,
        deleted: false 
    });

    if(!user){
        req.flash("error", "Không tìm thấy tài khoản");
        res.redirect("back");
        return;
    }

    const forgotObject = {
        email: email,
        otp: generate.generateRandomNumber(8),
        expireAt: Date.now()
    };
    console.log(forgotObject);
    const forgot = new Forgot(forgotObject);
    await forgot.save();
    res.send("OK");
}