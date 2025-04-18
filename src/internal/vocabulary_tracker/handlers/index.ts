import { Request, RequestHandler, Response } from "express"

import { IVocabularyTracker } from ".."
import { ISearchSynonymsRequest, IWordExplanationRequest } from "../../../types"
import logger from "../../../utils/logger"

export const getWordsListHandler = (vocabularyTrackerService: IVocabularyTracker): RequestHandler => {
  return async (_req: Request, res: Response): Promise<void> => {
    try {
      const response = await vocabularyTrackerService.wordsList()

      res.status(200).json(response)
    } catch (error: unknown) {
      logger.error(`getWordsListHandler | error: ${error}`)
      res.status(500).json({ error: "Internal Server Error" })
    }
  }
}

export const getWordExplanationHandler = (vocabularyTrackerService: IVocabularyTracker): RequestHandler => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = req.body as IWordExplanationRequest

      if (!dto.word || !dto.language || !dto.translation_language) {
        res.status(400).json({
          error: "getWordExplanationHandler | Missing required fields in payload",
        })
        return
      }

      const response = await vocabularyTrackerService.getWordExplanation(dto)

      res.status(200).json(response)
    } catch (error: unknown) {
      logger.error(`getWordExplanationHandler | error: ${error}`)
      res.status(500).json({ error: "Internal Server Error" })
    }
  }
}

export const getWordAudioHandler = (vocabularyTrackerService: IVocabularyTracker): RequestHandler => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = req.body as IWordExplanationRequest

      if (!dto.word || !dto.language || !dto.translation_language) {
        res.status(400).json({
          error: "getWordExplanationHandler | Missing required fields in payload",
        })
        return
      }

      const response = await vocabularyTrackerService.getWordAudio(dto)

      res.status(200).json(response)
    } catch (error: unknown) {
      logger.error(`getWordExplanationHandler | error: ${error}`)
      res.status(500).json({ error: "Internal Server Error" })
    }
  }
}

export const searchWordsSynonymsHandler = (vocabularyTrackerService: IVocabularyTracker): RequestHandler => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = req.body as ISearchSynonymsRequest

      if (!dto.payload.messages || !dto.language || !dto.translation_language) {
        res.status(400).json({
          error: "getWordExplanationHandler | Missing required fields in payload",
        })
        return
      }

      const response = await vocabularyTrackerService.searchSynonymsByHistory(dto)

      res.status(200).json(response)
    } catch (error: unknown) {
      logger.error(`getWordExplanationHandler | error: ${error}`)
      res.status(500).json({ error: "Internal Server Error" })
    }
  }
}
