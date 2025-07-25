import mongoose, { Document, Schema } from "mongoose"

import { ISessionEntity, SessionIeltsPartEnum, SessionStatusEnum, SessionTypeEnum } from "../../../../types"
import { MODEL_NAME as ORGANISATION_TABLE } from "../../../organisation/storage/mongo/model"
import { MODEL_NAME as USER_TABLE } from "../../../user/storage/mongo/model"

export const MODEL_NAME = "sessions"

export type ISessionDocument = ISessionEntity & Document

const sessionSchema = new Schema<ISessionDocument>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: USER_TABLE, required: false, default: null },
    organization_id: { type: Schema.Types.ObjectId, ref: ORGANISATION_TABLE, required: false, default: null },
    prompt_id: { type: String, required: true },
    active_ielts_part: { type: Number, enum: [1, 2, 3], required: false },
    type: { type: String, enum: Object.values(SessionTypeEnum), required: true },
    status: { type: String, enum: Object.values(SessionStatusEnum), default: SessionStatusEnum.ACTIVE },
    system_prompt: { type: String, default: "" },
    session_directory: { type: String, default: "" },
    ended_at: { type: Date, default: null },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
)

export const SessionModel = mongoose.model<ISessionEntity>(MODEL_NAME, sessionSchema)
