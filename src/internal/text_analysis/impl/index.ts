import { ITextAnalysis } from ".."
import { openaiREST } from "../../../config"
import { IGPTPayload, ISimulationDialogResponse, ITextAnalysisResponse } from "../../../types"
import logger from "../../../utils/logger"
import ConversationResponseSchema from "./json_schema/conversation_response.schema.json"
import SimulationStartResponseSchema from "./json_schema/simulation_start_response.schema.json"
import { CONVERSATION_RESPONSE_SYSTEM_PROMPT } from "./prompt"

export class TextAnalysisService implements ITextAnalysis {
  async gptConversation(payload: IGPTPayload): Promise<ITextAnalysisResponse> {
    try {
      const messages = payload.messages ?? []
      const userMessages = messages.filter((item) => item.role === "user")
      const lastUserMessage = userMessages[userMessages.length - 1]

      if (messages.length === 0) {
        throw new Error("no messages provided in payload.")
      }

      if (messages[0].role !== "system") {
        throw new Error("first message must be a system prompt.")
      }

      if (userMessages.length === 0) {
        throw new Error("no user messages provided in payload.")
      }

      if (lastUserMessage.content === "") {
        throw new Error("no user content provided in last message.")
      }

      messages[0].content = CONVERSATION_RESPONSE_SYSTEM_PROMPT + "\n\n" + messages[0].content

      const response = await openaiREST.chat.completions.create({
        model: payload.model,
        messages,
        temperature: payload.temperature || 0.7,
        max_tokens: payload.max_tokens || 1500,
        tools: [
          {
            type: "function",
            function: {
              name: "structured_response_tool",
              description: "Process user conversation and provide structured JSON response.",
              parameters: ConversationResponseSchema,
            },
          },
        ],
        tool_choice: {
          type: "function",
          function: { name: "structured_response_tool" },
        },
      })

      const toolCall = response.choices?.[0]?.message?.tool_calls?.[0]
      const choice = response.choices?.[0]

      if (choice.finish_reason === "length") {
        throw new Error("OpenAI response was cut off due to max_tokens limit.")
      }

      if (!toolCall?.function?.arguments) {
        throw new Error("no tool response returned by model.")
      }

      return JSON.parse(toolCall.function.arguments) as ITextAnalysisResponse
    } catch (error: unknown) {
      logger.error(`gptConversation | error: ${error}`)
      throw error
    }
  }

  async createScenarioDialog(payload: IGPTPayload): Promise<ISimulationDialogResponse> {
    try {
      const messages = payload.messages ?? []
      const userMessages = messages.filter((item) => item.role === "user")

      if (messages.length === 0) {
        throw new Error("no messages provided in payload.")
      }

      if (messages[0].role !== "system") {
        throw new Error("first message must be a system prompt.")
      }

      if (userMessages.length === 0) {
        throw new Error("no user messages provided in payload.")
      }

      const response = await openaiREST.chat.completions.create({
        model: payload.model,
        messages,
        temperature: payload.temperature || 0.7,
        max_tokens: payload.max_tokens || 1500,
        tools: [
          {
            type: "function",
            function: {
              name: "structured_response_tool",
              description: "Process user conversation and provide structured JSON response.",
              parameters: SimulationStartResponseSchema,
            },
          },
        ],
        tool_choice: {
          type: "function",
          function: { name: "structured_response_tool" },
        },
      })

      const toolCall = response.choices?.[0]?.message?.tool_calls?.[0]
      const choice = response.choices?.[0]

      if (choice.finish_reason === "length") {
        throw new Error("OpenAI response was cut off due to max_tokens limit.")
      }

      if (!toolCall?.function?.arguments) {
        throw new Error("no tool response returned by model.")
      }

      return JSON.parse(toolCall.function.arguments) as ISimulationDialogResponse
    } catch (error: unknown) {
      logger.error(`createScenarioDialog | error: ${error}`)
      throw error
    }
  }
}
