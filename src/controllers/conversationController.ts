import { Request, Response, RequestHandler } from "express"
import { processConversation } from "../services/conversationService"
import { conversationSchema } from "../validation/conversationValidation"
import logger from "../utils/logger"

export const conversationHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedBody = conversationSchema.parse({
      whisper: {
        ...JSON.parse(req.body.whisper),
        audioFile: req.file,
      },
      gpt_model: JSON.parse(req.body.gpt_model),
      tts: JSON.parse(req.body.tts),
      system: JSON.parse(req.body.system),
    })

    if (!parsedBody.whisper.audioFile) {
      res.status(400).json({ error: "Missing audio file" })
      return
    }

    let streamEnded = false

    res.on("close", () => {
      streamEnded = true
    })

    const { whisper, gpt_model, tts, system } = parsedBody

    const { session_id, conversation_history } = await processConversation(
      { whisper, gpt_model, tts, system },
      (role, content, audioUrl, audioChunk) => {
        if (streamEnded) return

        const data: { role: string; content?: string; audioUrl?: string; audioChunk?: string } = { role }
        if (content) data.content = content
        if (audioUrl) data.audioUrl = audioUrl
        if (audioChunk) data.audioChunk = audioChunk.toString("base64")

        try {
          res.write(`${JSON.stringify(data)}\n`)
        } catch (error) {
          logger.error("conversationHandler | Error writing to stream:", error)
        }
      }
    )

    if (!streamEnded) {
      res.write(
        JSON.stringify({
          session_id,
          conversation_history,
        })
      )
      res.end()
    }
  } catch (error: unknown) {
    logger.error("conversationController | error:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
}
