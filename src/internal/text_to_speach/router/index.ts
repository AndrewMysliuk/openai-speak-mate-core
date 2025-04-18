import { Router } from "express"

import { textToSpeachHandler, textToSpeechElevenLabsHandler } from "../handlers"
import { ITextToSpeach } from "../index"

const router = Router()

export default router

export const createTextToSpeachRouter = (textToSpeachService: ITextToSpeach): Router => {
  const router = Router()

  router.post("/", textToSpeachHandler(textToSpeachService))
  router.post("/eleven-labs", textToSpeechElevenLabsHandler(textToSpeachService))

  return router
}
