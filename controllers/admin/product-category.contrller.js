const ProductCategory = require("../../models/product-category.model")
const systemConfig = require("../../config/system")
const createTreeHelper = require("../../helpers/createTree")
//[GET] /admin/products-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }
    const records = await ProductCategory.find(find)
    const newRecords = createTreeHelper.tree(records)

    res.render("admin/pages/product-category/index", {
        pageTitle: "danh mục sản phẩm",
        records: newRecords,
    });
}
//[GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await ProductCategory.find(find)
    const newRecords = createTreeHelper.tree(records)
    res.render("admin/pages/product-category/create", {
        pageTitle: "Tạo danh mục sản phẩm",
        records: newRecords
    });
}
//[POST] admin/products-category/create
module.exports.createPost = async (req, res) => {
    // const permissions = res.locals.role.permissions
    // if (permissions.includes("products-category_create")) {
    //     console.log("có quyền");
    // } else {
    //     res.send("403")
    //     return
    // }
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
//[GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id
        const data = await ProductCategory.findOne({
            _id: id,
            deleted: false
        })
        const records = await ProductCategory.find({
            deleted: false
        })
        const newRecords = createTreeHelper.tree(records)
        console.log(data);
        res.render("admin/pages/product-category/edit", {
            pageTitle: "Chỉnh sửa danh mục sản phẩm",
            data: data,
            records: newRecords,
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    };
}
//[PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id
    req.body.position = parseInt(req.body.position)
    await ProductCategory.updateOne({
        _id: id
    }, req.body)
    res.redirect("back")
}