const express = require("express");

require("dotenv").config()
const { connectionToMongodb } = require("./config/db.js");


const PORT = process.env.PORT || 3200
const app = express();
app.use(express.json())

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok'})
});

const start = async () => {
    try {
        await connectionToMongodb()
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (err) {
        console.error(err)
        process.exit(1)
    }

}
start()
