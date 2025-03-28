import tiktoken from "tiktoken"

import { GPTRoleType, IConversationHistory } from "../types"

export const convertMessageToString = (message: string | ArrayBuffer | Buffer | Buffer[]): string => {
  if (typeof message === "string") {
    return message
  }

  if (Buffer.isBuffer(message)) {
    return message.toString()
  }

  if (message instanceof ArrayBuffer) {
    return Buffer.from(message).toString()
  }

  if (Array.isArray(message)) {
    return Buffer.concat(message).toString()
  }

  return ""
}

const countTokens = (history: IConversationHistory[]): number => {
  const encoding = tiktoken.get_encoding("cl100k_base")
  return history.reduce((acc, message) => acc + encoding.encode(message.content).length, 0)
}

export const trimConversationHistory = (conversationHistory: IConversationHistory[], max_tokens: number, currentPairId: string): IConversationHistory[] => {
  const systemPrompt = conversationHistory[0]
  let trimmedHistory = conversationHistory.slice(1)

  while (countTokens([systemPrompt, ...trimmedHistory]) > max_tokens && trimmedHistory.length > 1) {
    const lastUserIndex = trimmedHistory
      .map((message, index) => ({ message, index }))
      .reverse()
      .find(({ message }) => message.role === "user" && message.pair_id !== currentPairId)

    if (!lastUserIndex) break

    const { index: userIndex, message: userMessage } = lastUserIndex
    const pairId = userMessage.pair_id
    const assistantIndex = trimmedHistory.findIndex((message, idx) => message.role === "assistant" && message.pair_id === pairId && idx > userIndex)

    if (assistantIndex !== -1) {
      trimmedHistory.splice(Math.min(userIndex, assistantIndex), 2)
    } else {
      trimmedHistory.splice(userIndex, 1)
    }
  }

  return [systemPrompt, ...trimmedHistory]
}

export const trimmedMessageHistoryForErrorAnalyser = (messages: Array<{ role: GPTRoleType; content: string }>) => {
  const first = messages[0]
  const lastUser = [...messages].reverse().find((msg) => msg.role === "user")

  if (first.role === "system" && lastUser) {
    return [first, lastUser]
  }

  return []
}
