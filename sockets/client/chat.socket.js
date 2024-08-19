const uploadToCloudinary = require("../../helpers/uploadToCloudinary")
const Chat = require("../../models/chat.model")

module.exports = (res) => {
    // SocketIo
    const fullName = res.locals.user.fullName
    const userId = res.locals.user.id
    _io.once('connection', (socket) => {
        socket.on("CLIENT_SEND_MESSAGE", async (data) => {
            let images = []
            for (const imageBuffer of data.images) {
                const link = await uploadToCloudinary(imageBuffer)
                images.push(link)
            }
            // lưu vào database
            const chat = new Chat({
                user_id: userId,
                content: data.content,
                images: images
            })
            await chat.save()
            // trả data về client
            _io.emit("SERVER_RETURN_MESSAGE", {
                userId: userId,
                fullName: fullName,
                content: data.content,
                images: images
            })
        })
        //typing
        socket.on("CLIENT_SEND_TYPING", async (type) => {
            socket.broadcast.emit("SERVER_RETURN_TYPING", {
                userId: userId,
                fullName: fullName,
                type: type
            })
        })
    })
}