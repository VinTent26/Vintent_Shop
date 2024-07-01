module.exports = (query) => {
    let filterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: "",
            warn: "success"
        },
        {
            name: "Hoạt động",
            status: "active",
            class: "",
            warn: "success"
        },
        {
            name: "Dừng hoạt động",
            status: "inactive",
            class: "",
            warn: "danger"
        },
    ]
    
    if(query.status){
        const index = filterStatus.findIndex(item => item.status == query.status)
        filterStatus[index].class = "active"
    }else{
        const index = filterStatus.findIndex(item => item.status == "")
        filterStatus[index].class = "active"
    }
    return filterStatus
}