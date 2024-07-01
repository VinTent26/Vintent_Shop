const Product = require("../../models/product.model")
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
const systemConfig = require("../../config/system")
//[GET] admin/products
module.exports.index = async (req, res) => {
    // console.log(req.query.status);
    const filterStatus = filterStatusHelper(req.query)
    let find = {
        deleted: false
    }
    if (req.query.status) {
        find.status = req.query.status
    }
    const objectSearch = searchHelper(req.query)
    if (objectSearch.regex) {
        find.title = objectSearch.regex
    }
    // pagination
    const countProduct = await Product.countDocuments(find)
    let objectPagination = paginationHelper({
            currentPage: 1,
            limitItem: 4
        },
        req.query,
        countProduct
    )
    //sort
    let sort = {}
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue
    } else {
        sort.position = "desc"
    }
    //end sort
    // end-pagination
    const products = await Product.find(find)
        .sort(sort)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip)
    // console.log(products);

    res.render("admin/pages/products/index", {
        pageTitle: "danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination

    });
}
// [Path] admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status
    const id = req.params.id
    await Product.updateOne({
        _id: id
    }, {
        status: status
    })
    req.flash('success', 'cập nhật thành công !!');
    res.redirect("back")
}
// [Path] admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type
    const ids = req.body.ids.split(", ");
    switch (type) {
        case "active":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: "active"
            })
            req.flash('success', `cập nhật thành công ${ids.length} sản phẩm!!`)
            break;
        case "inactive":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: "inactive"
            })
            req.flash('success', `cập nhật thành công ${ids.length} sản phẩm!!`)
            break;
        case "delete-all":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                deleted: true,
                deletedAt: new Date()
            })
            req.flash('success', `Đã xóa thành công ${ids.length} sản phẩm!!`)
            break;
        case "change-position":

            for (const item of ids) {
                let [id, position] = item.split("-")
                position = parseInt(position)
                await Product.updateOne({
                    _id: id
                }, {
                    position: position
                })
                req.flash('success', `Đã thay đổi vị trí thành công!!`)
            }

            break;
        default:
            break;
    }
    res.redirect("back")
}
// [Delete] admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id
    //xóa cứng
    // await Product.deleteOne({ _id: id })
    // xóa mềm
    await Product.updateOne({
        _id: id
    }, {
        deleted: true,
        deletedAt: new Date()
    })
    req.flash('success', `Đã xóa thành công sản phẩm!!`)
    res.redirect("back")
}
//[GET] admin/products/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "danh sách sản phẩm",


    });
}
//[POST] admin/products/create
module.exports.createPost = async (req, res) => {

    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)

    if (req.body.position == "") {
        const countProducts = await Product.countDocuments()
        req.body.position = countProducts + 1
    } else {
        req.body.position = parseInt(req.body.position)
    }
    const product = new Product(req.body)
    await product.save()
    res.redirect(`${systemConfig.prefixAdmin}/products`)
}
//[GET] admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const product = await Product.findOne(find)
        res.render("admin/pages/products/edit", {
            pageTitle: "chỉnh sửa sản phẩm",
            product: product
        });
    } catch (error) {
        req.flash("error", " không tồn tại sản phẩm ")
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }

}
//[PATCH] admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    req.body.position = parseInt(req.body.position)
    try {
        await Product.updateOne({
            _id: id
        }, req.body)
        req.flash("success", " cập nhập thành công ")
    } catch (error) {
        req.flash("error", " cập nhập thất bại ")
    }

    res.redirect("back")
}
//[GET] admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const product = await Product.findOne(find)
        res.render("admin/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }

}