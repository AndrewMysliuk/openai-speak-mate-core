import { IListenAndTypeItem, ISimulationDialogue, ITTSElevenLabsPayload, ITTSPayload } from "../../types"

export interface ITextToSpeach {
  ttsTextToSpeechStream(payload: ITTSPayload, session_folder?: string, output?: { filePath?: string }): AsyncGenerator<Buffer, void>
  ttsTextToSpeechStreamElevenLabs(payload: ITTSElevenLabsPayload, session_folder?: string, output?: { filePath?: string }): AsyncGenerator<Buffer, void>
  ttsTextToSpeechListeningTask(payload: ITTSPayload, items: IListenAndTypeItem[]): Promise<IListenAndTypeItem[]>
  ttsTextToSpeechDialog(dialog: ISimulationDialogue): Promise<ISimulationDialogue>
  ttsTextToSpeechBase64(payload: ITTSPayload, word: string): Promise<string>
}
