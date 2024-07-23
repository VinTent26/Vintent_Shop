const Product = require("../../models/product.model")
const ProductCategory = require("../../models/product-category.model")
const productHelper = require("../../helpers/product")
const productCategoryHelper = require("../../helpers/product-category")
//[GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({
        position: "desc"
    })
    const newProducts = productHelper.priceNewProducts(products)
    res.render("client/pages/products/index", {
        pageTitle: "sản phẩm ",
        products: newProducts
    });
}
//[GET] /products/:slugproduct
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            slug: req.params.slugProduct,
            status: "active"
        }
        const product = await Product.findOne(find)
        if (product.product_category_id) {
            const category = await ProductCategory.findOne({
                _id: product.product_category_id,
                status: "active",
                deleted: false
            })
            product.category = category
        }
        product.priceNew = productHelper.priceNewProduct(product)
        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        res.redirect(`/products`)
    }

}
//[GET] /products/:slugCategory
module.exports.category = async (req, res) => {
    const category = await ProductCategory.findOne({
        slug: req.params.slugCategory,
        status: "active",
        deleted: false
    })

    const ListSubCategory = await productCategoryHelper.getSubCategory(category.id)
    const ListSubCategoryId = ListSubCategory.map(item => item.id)
    const products = await Product.find({
        product_category_id: {
            $in: [category.id, ...ListSubCategoryId]
        },
        deleted: false
    }).sort({
        position: "desc"
    })
    const newProducts = productHelper.priceNewProducts(products)
    res.render("client/pages/products/index", {
        pageTitle: category.title,
        products: newProducts
    });
}