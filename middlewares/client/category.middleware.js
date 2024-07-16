const ProductCategory = require("../../models/product-category.model")
const createTreeHelper = require("../../helpers/createTree")
module.exports.category = async (req, res, next) => {
    const records = await ProductCategory.find({
        deleted: false
    })
    const newProductCategory = createTreeHelper.tree(records)
    res.locals.layoutProductCategory = newProductCategory
    next()
}