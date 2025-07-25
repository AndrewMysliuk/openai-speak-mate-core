import { IMongooseOptions, IPlanEntity } from "../../types"

export interface IPlanService {
  create(data: Partial<IPlanEntity>, options?: IMongooseOptions): Promise<IPlanEntity>
  publicList(options?: IMongooseOptions): Promise<IPlanEntity[]>
  getById(id: string, options?: IMongooseOptions): Promise<IPlanEntity | null>
}
