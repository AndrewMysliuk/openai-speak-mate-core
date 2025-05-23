import { IOrganisationService } from ".."
import { IMongooseOptions, IOrganizationEntity, IOrganizationUpdateRequest } from "../../../types"
import { logger } from "../../../utils"
import { IRepository } from "../storage"

export class OrganisationService implements IOrganisationService {
  private readonly orgRepo: IRepository

  constructor(orgRepo: IRepository) {
    this.orgRepo = orgRepo
  }

  async create(name: string, options?: IMongooseOptions): Promise<IOrganizationEntity> {
    try {
      const organization = await this.orgRepo.create({ name }, options)
      return organization
    } catch (error: unknown) {
      logger.error(`create | error: ${error}`)
      throw error
    }
  }

  async setOwner(id: string, owner_id: string, options?: IMongooseOptions): Promise<IOrganizationEntity> {
    try {
      const organization = await this.orgRepo.update(id, { owner_id }, options)

      if (!organization) {
        throw new Error(`Organization with id ${id} not found`)
      }

      return organization
    } catch (error: unknown) {
      logger.error(`setOwner | error: ${error}`)
      throw error
    }
  }

  async update(id: string, dto: IOrganizationUpdateRequest, options?: IMongooseOptions): Promise<IOrganizationEntity | null> {
    try {
      return this.orgRepo.update(id, dto, options)
    } catch (error: unknown) {
      logger.error(`setOwner | error: ${error}`)
      throw error
    }
  }
}
