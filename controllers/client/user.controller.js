const md5 = require("md5")
const User = require("../../models/user.model")
const generateHelper = require("../../helpers/generate")
const sendMailHelper = require("../../helpers/sendMail")
const ForgotPassword = require("../../models/forgot-password.route")
const Cart = require("../../models/cart.model")
//[GET] /user/register
module.exports.register = async (req, res) => {

    res.render("client/pages/user/register", {
        pageTitle: "Đăng kí",

    });
}
//[POST] /user/register
module.exports.registerPost = async (req, res) => {
    const existEmail = await User.findOne({
        email: req.body.email
    })
    if (existEmail) {
        req.flash("error", "Email không tồn tại  ")
        res.redirect("back")
        return
    }
    req.body.password = md5(req.body.password)
    const user = new User(req.body)
    await user.save()
    res.cookie("tokenUser", user.tokenUser)
    res.redirect("/")
}
//[GET] /user/login
module.exports.login = async (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng Nhập",

    });
}
//[POST] /user/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const user = await User.findOne({
        email: email,
        deleted: false
    })
    if (!user) {
        req.flash("error", "Email không tồn tại  ")
        res.redirect("back")
        return
    }
    if (md5(password) !== user.password) {
        req.flash("error", "Mật khẩu không đúng ")
        res.redirect("back")
        return
    }
    if (user.status === "inactive") {
        req.flash("error", "Taig khoản đã bị khóa ")
        res.redirect("back")
        return
    }
    const cart = await Cart.findOne({
        user_id: user.id
    })
    if (cart) {
        res.cookie("cartId", cart.id)
    } else {
        await Cart.updateOne({
            _id: req.cookies.cartId
        }, {
            user_id: user.id
        })
    }

    res.cookie("tokenUser", user.tokenUser)
    res.redirect("/")
}
//[GET] /user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser")
    res.clearCookie("cartId")
    res.redirect("/")
}
//[GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Lấy lại mật khẩu",
    });
}
//[POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email
    console.log(email);
    const user = await User.findOne({
        email: email,
        deleted: false
    })
    if (!user) {
        req.flash("error", "Email không tồn tại")
        res.redirect("back")
        return
    }
    //lưu thông tin vào DB
    const otp = generateHelper.generateRandomNumber(6)
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    }
    const forgotPassword = new ForgotPassword(objectForgotPassword)
    await forgotPassword.save()
    // nêu tồn tại thì gửi otp qua email
    const subject = "Mã OTP xác minh lấy lại mật khẩu "
    const html = `
        Mã OTP để lấy lại mật khẩu là : <b style="color:green">${otp}</b>. Thời hạn sử dụng là 3 phút 
    `
    sendMailHelper.sendMail(email, subject, html)
    res.redirect(`/user/password/otp?email=${email}`)
}
//[GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email
    res.render("client/pages/user/otp-password", {
        pageTitle: "Nhập mã OTP",
        email: email

    });
}
//[POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email
    const otp = req.body.otp
    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })
    if (!result) {
        req.flash("error", "OTP không hợp lệ!")
        res.redirect("back")
        return
    }
    const user = await User.findOne({
        email: email,
    })
    res.cookie("tokenUser", user.tokenUser)
    res.redirect("/user/password/reset")

}
//[GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {

    res.render("client/pages/user/reset-password", {
        pageTitle: "Đặt lại mật khẩu",
    });
}
//[POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password
    const tokenUser = req.cookies.tokenUser
    await User.updateOne({
        tokenUser: tokenUser
    }, {
        password: md5(password)
    })
    res.redirect("/")
}
//[GET] /user/info
module.exports.info = async (req, res) => {
    // const tokenUser = req.cookies.tokenUser
    // const infoUser = await User.findOne({
    //     tokenUser: tokenUser
    // }).select("-password")
    // console.log(infoUser);
    res.render("client/pages/user/info", {
        pageTitle: "Thông tin cá nhân",

    });
}