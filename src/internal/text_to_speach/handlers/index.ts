import { Request, RequestHandler, Response } from "express"

import { ITTSElevenLabsPayload, ITTSPayload } from "../../../types"
import { logger } from "../../../utils"
import { ITextToSpeach } from "../index"

export const textToSpeachHandler = (textToSpeachService: ITextToSpeach): RequestHandler => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const { model, voice, input, response_format = "wav" } = req.body as ITTSPayload

      if (!model || !voice || !input) {
        res.status(400).json({
          error: "textToSpeachController | Missing required fields in payload",
        })
        return
      }

      res.writeHead(200, {
        "Content-Type": `audio/${response_format}`,
        "Transfer-Encoding": "chunked",
        "Content-Disposition": 'inline; filename="tts-output.' + response_format + '"',
      })

      const output: { filePath?: string } = {}
      const ttsStream = textToSpeachService.ttsTextToSpeechStream(req.body, undefined, output, true)

      for await (const chunk of ttsStream) {
        res.write(chunk)
      }

      logger.debug("Saved TTS audio:", output.filePath)
      res.end()
    } catch (error: unknown) {
      logger.error("textToSpeachController | error in ttsTextToSpeachHandler:", error)
      if (!res.headersSent) {
        res.status(500).json({ error: "Internal Server Error" })
      } else {
        res.end()
      }
    }
  }
}

export const textToSpeechElevenLabsHandler = (textToSpeachService: ITextToSpeach): RequestHandler => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const { input, voice } = req.body as ITTSElevenLabsPayload

      if (!input || !voice) {
        res.status(400).json({
          error: "Missing required fields: input, voice",
        })
        return
      }

      res.writeHead(200, {
        "Content-Type": `audio/mp3`,
        "Transfer-Encoding": "chunked",
        "Content-Disposition": `inline; filename="tts-output.mp3"`,
      })

      const output: { filePath?: string } = {}
      const ttsStream = textToSpeachService.ttsTextToSpeechStreamElevenLabs(req.body, undefined, output)

      for await (const chunk of ttsStream) {
        res.write(chunk)
      }

      logger.debug("ElevenLabs TTS audio saved at:", output.filePath)
      res.end()
    } catch (error: unknown) {
      logger.error("textToSpeechHandlerElevenLabs | error:", error)
      if (!res.headersSent) {
        res.status(500).json({ error: "Internal Server Error" })
      } else {
        res.end()
      }
    }
  }
}
