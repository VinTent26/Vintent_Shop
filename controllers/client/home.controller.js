const Product = require("../../models/product.model")
const productHelper = require("../../helpers/product")
//[GET] /products
module.exports.index = async (req, res) => {
    //lấy ra sản phẩm nổi bật
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    }).limit(6)
    const newProductsFeatured = productHelper.priceNewProducts(productsFeatured)
    // hiển thị danh sách sản phẩm mới nhất
    const productsNew = await Product.find({
        deleted: false,
        status: "active"
    }).sort({
        position: "desc"
    }).limit(6)
    const newProductNew = productHelper.priceNewProducts(productsNew)
    res.render("client/pages/home/index", {
        pageTitle: "trang chủ",
        productsFeatured: newProductsFeatured,
        productsNew: newProductNew
    });
}