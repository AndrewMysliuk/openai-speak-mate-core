import { IConversationHistory } from "../../../../types"
import { IRepository } from "../index"
import { ConversationHistoryModel } from "./model"

export class HistoryRepository implements IRepository {
  async saveHistory(history_data: Partial<IConversationHistory>): Promise<IConversationHistory> {
    const history = new ConversationHistoryModel(history_data)
    return await history.save()
  }

  async getHistoryBySession(session_id: string): Promise<IConversationHistory[]> {
    return await ConversationHistoryModel.find({ session_id }).sort({
      created_at: 1,
    })
  }

  async deleteHistoryById(session_id: string, message_id: string): Promise<void> {
    await ConversationHistoryModel.deleteOne({ session_id, _id: message_id })
  }

  async deleteHistoryByPairId(session_id: string, pair_id: string): Promise<void> {
    await ConversationHistoryModel.deleteMany({ session_id, pair_id })
  }
}
