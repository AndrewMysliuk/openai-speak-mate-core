import { Router } from "express"

import { createPaddleMiddleware } from "../../../middlewares"
import { IUserProgressService } from "../../user_progress"
import { deleteAllHistoryHandler, deleteReviewHandler, generateConversationReviewHandler, getReviewHandler, reviewsListHandler, updateAudioUrlHandler } from "../handlers"
import { ICommunicationReviewService } from "../index"

export const createCommunicationReviewRouter = (communicationReviewService: ICommunicationReviewService, userProgressService: IUserProgressService): Router => {
  const router = Router()

  router.post("/update-audio-url", createPaddleMiddleware, updateAudioUrlHandler(communicationReviewService))
  router.post("/", createPaddleMiddleware, generateConversationReviewHandler(communicationReviewService, userProgressService))
  router.get("/", reviewsListHandler(communicationReviewService))
  router.delete("/all-history", deleteAllHistoryHandler(communicationReviewService))
  router.delete("/:id", deleteReviewHandler(communicationReviewService))
  router.get("/:id", getReviewHandler(communicationReviewService))

  return router
}
