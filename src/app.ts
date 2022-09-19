import express from 'express'
import 'dotenv/config'
import {
    createShortUrl,
    handleRedirect,
    getAnalytics,
} from "./controller/shortUrl.controller"
import validateResource from "./middleware/validateResource.middleware"
import shortUrlSchema from "./validation/shortUrl.validation"
import mongoose from 'mongoose'
import bodyParser from 'body-parser'

const app = express()
const router = express.Router()
const port = process.env.PORT
const mongoUri = process.env.MONGO_URI

const connect = async () => {
    if (!mongoUri) {
        console.error("mongodb is not available")
        return
    }

    try {
        await mongoose.connect(mongoUri)
        console.log(`mongoose DB connected!`)
    } catch (error) {
        console.error(error)
    }
}

app.use(bodyParser.json())
app.use(router)

router.post("/api/url", validateResource(shortUrlSchema), createShortUrl)

router.get("/:shortId", handleRedirect)

router.get("/api/analytics/:shortId", getAnalytics)

app.listen(port, async () => {
    console.log(`server is listening on port ${port}`)
    await connect()
})
