import { Request, Response } from "express"
import ShortUrl from "../models/shortUrl.model"
import Analytics from "../models/analytics.model"

export async function createShortUrl(req: Request, res: Response) {
  const { destination } = req.body

  let url = await ShortUrl.findOne({ destination })

  if (!url) {
    try {

      url = await ShortUrl.create({ destination })
      return res.send(`${process.env.BASE}/${url.shortId}`)

    } catch (error) {
      res.send(error)
    }
  } else {
    res.send(`${process.env.BASE}/${url.shortId}`)
  }

}

export async function handleRedirect(req: Request, res: Response) {
  const { shortId } = req.params

  const short = await ShortUrl.findOne({ shortId }).lean()

  if (!short) {
    return res.sendStatus(404)
  }
  await Analytics.create({ shortUrl: short._id })

  return res.redirect(short.destination)
}

export async function getAnalytics(req: Request, res: Response) {
  const { shortId } = req.params

  const short = await ShortUrl.findOne({ shortId }).lean()
  const data = await Analytics.find({ shortUrl: short?._id }).count()
  return res.json(data)
}
