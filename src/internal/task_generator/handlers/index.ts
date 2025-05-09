import { Request, RequestHandler, Response } from "express"

import { logger } from "../../../utils"
import { ITaskGenerator } from "../index"
import { TaskGeneratorRequestSchema, TaskGeneratorRequestType } from "./validation"

export const taskGeneratorHandler = (taskGeneratorService: ITaskGenerator): RequestHandler => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = TaskGeneratorRequestSchema.safeParse(req.body)

      if (!parsed.success) {
        logger.warn("taskGeneratorHandler | validation error:", parsed.error.format())
        res.status(400).json({ error: "Invalid request", details: parsed.error.format() })
        return
      }

      const validData: TaskGeneratorRequestType = parsed.data

      const result = await taskGeneratorService.generateTask(validData)

      res.status(200).json(result)
    } catch (error: unknown) {
      logger.error("taskGeneratorHandler | error:", error)
      res.status(500).json({ error: "Internal Server Error" })
    }
  }
}
