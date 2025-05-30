import { Request, RequestHandler, Response } from "express"

import { Types } from "mongoose"

import { IPromptService } from ".."
import { IModuleFilters, IPromptFilters } from "../../../types"
import { logger } from "../../../utils"
import { CreateModuleSchema, CreateScenarioSchema, UpdateModuleSchema, UpdateScenarioSchema } from "./validation"

export const createScenarioHandler = (promptService: IPromptService): RequestHandler => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = CreateScenarioSchema.safeParse(req.body)

      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() })
        return
      }

      const user_id = new Types.ObjectId(req.user!.user_id)
      const organization_id = new Types.ObjectId(req.user!.organization_id)

      const scenario = await promptService.createScenario({ ...parsed.data, user_id, organization_id })

      res.status(201).json(scenario)
    } catch (error: unknown) {
      logger.error(`createScenarioHandler | error: ${error}`)
      res.status(500).json({ error: "Internal Server Error" })
    }
  }
}

export const updateScenarioHandler = (promptService: IPromptService): RequestHandler => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params

      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid scenario id" })
        return
      }

      const parsed = UpdateScenarioSchema.safeParse(req.body)

      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() })
        return
      }

      const user_id = new Types.ObjectId(req.user!.user_id)
      const organization_id = new Types.ObjectId(req.user!.organization_id)

      const updated = await promptService.updateScenario(id, { ...parsed.data, user_id, organization_id })
      res.status(200).json(updated)
    } catch (error: unknown) {
      logger.error(`updateScenarioHandler | error: ${error}`)
      res.status(500).json({ error: "Internal Server Error" })
    }
  }
}

export const getScenarioHandler = (promptService: IPromptService): RequestHandler => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params

      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid scenario id" })
        return
      }

      const scenario = await promptService.getScenario(id)

      if (!scenario) {
        res.status(404).json({ error: "Scenario not found" })
        return
      }

      res.status(200).json(scenario)
    } catch (error: unknown) {
      logger.error(`getScenarioHandler | error: ${error}`)
      res.status(500).json({ error: "Internal Server Error" })
    }
  }
}

export const listScenariosHandler = (promptService: IPromptService): RequestHandler => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, is_module_only, limit = 20, offset = 0, user_id, organization_id } = req.query

      const filter: IPromptFilters = {
        title: title as string,
        is_module_only: is_module_only === "true",
      }

      if (user_id) {
        filter.user_id = user_id as string
      }

      if (organization_id) {
        filter.organization_id = organization_id as string
      }

      const scenarios = await promptService.listScenario(filter, { limit: Number(limit), offset: Number(offset) })

      res.status(200).json(scenarios)
    } catch (error: unknown) {
      logger.error(`listScenariosHandler | error: ${error}`)
      res.status(500).json({ error: "Internal Server Error" })
    }
  }
}

export const createModuleHandler = (promptService: IPromptService): RequestHandler => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = CreateModuleSchema.safeParse(req.body)

      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() })
        return
      }

      const user_id = new Types.ObjectId(req.user!.user_id)
      const organization_id = new Types.ObjectId(req.user!.organization_id)

      const module = await promptService.createModule({ ...parsed.data, user_id, organization_id })

      res.status(201).json(module)
    } catch (error: unknown) {
      logger.error(`createModuleHandler | error: ${error}`)
      res.status(500).json({ error: "Internal Server Error" })
    }
  }
}

export const updateModuleHandler = (promptService: IPromptService): RequestHandler => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params

      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid module id" })
        return
      }

      const parsed = UpdateModuleSchema.safeParse(req.body)

      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() })
        return
      }

      const user_id = new Types.ObjectId(req.user!.user_id)
      const organization_id = new Types.ObjectId(req.user!.organization_id)

      const updated = await promptService.updateModule(id, { ...parsed.data, user_id, organization_id })

      res.status(200).json(updated)
    } catch (error: unknown) {
      logger.error(`updateModuleHandler | error: ${error}`)
      res.status(500).json({ error: "Internal Server Error" })
    }
  }
}

export const getModuleHandler = (promptService: IPromptService): RequestHandler => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid module id" })
        return
      }

      const module = await promptService.getModule(id)
      if (!module) {
        res.status(404).json({ error: "Module not found" })
        return
      }

      res.status(200).json(module)
    } catch (error: unknown) {
      logger.error(`getModuleHandler | error: ${error}`)
      res.status(500).json({ error: "Internal Server Error" })
    }
  }
}

export const listModulesHandler = (promptService: IPromptService): RequestHandler => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, limit = 20, offset = 0, user_id, organization_id } = req.query

      const filter: IModuleFilters = {
        title: title as string,
      }

      if (user_id) {
        filter.user_id = user_id as string
      }

      if (organization_id) {
        filter.organization_id = organization_id as string
      }

      const modules = await promptService.listModule({ title: title as string }, { limit: Number(limit), offset: Number(offset) })

      res.status(200).json(modules)
    } catch (error: unknown) {
      logger.error(`listModulesHandler | error: ${error}`)
      res.status(500).json({ error: "Internal Server Error" })
    }
  }
}

export const getModuleScenariosHandler = (promptService: IPromptService): RequestHandler => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params

      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid module id" })
        return
      }

      const scenarios = await promptService.getScenariosForModule(id)

      res.status(200).json(scenarios)
    } catch (error: unknown) {
      logger.error(`getModuleScenariosHandler | error: ${error}`)
      res.status(500).json({ error: "Internal Server Error" })
    }
  }
}
