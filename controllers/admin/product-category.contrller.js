const ProductCategory = require("../../models/product-category.model")
const systemConfig = require("../../config/system")
//[GET] /admin/products-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }
    const records = await ProductCategory.find(find)

    res.render("admin/pages/product-category/index", {
        pageTitle: "danh mục sản phẩm",
        records: records,
    });
}
//[GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/product-category/create", {
        pageTitle: "Tạo danh mục sản phẩm",
    });
}
//[POST] admin/products-category/create
module.exports.createPost = async (req, res) => {

    // req.body.price = parseInt(req.body.price)
    // req.body.discountPercentage = parseInt(req.body.discountPercentage)
    // req.body.stock = parseInt(req.body.stock)

    if (req.body.position == "") {
        const count = await ProductCategory.countDocuments()
        req.body.position = count + 1
    } else {
        req.body.position = parseInt(req.body.position)
    }
    const record = new ProductCategory(req.body)
    await record.save()
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)

}