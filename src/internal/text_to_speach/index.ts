import { ITTSElevenLabsPayload, ITTSPayload } from "../../types"

export interface ITextToSpeach {
  ttsTextToSpeechStream(payload: ITTSPayload, session_folder?: string, output?: { filePath?: string }, saveToFile?: boolean): AsyncGenerator<Buffer, void>
  ttsTextToSpeechStreamElevenLabs(payload: ITTSElevenLabsPayload, session_folder?: string, output?: { filePath?: string }): AsyncGenerator<Buffer, void>
  ttsTextToSpeechBase64(payload: ITTSPayload, word: string): Promise<string>
}

/* 
✅ Лучшие голоса для разных языков:

- nova:
  - 🇺🇸 Английский (американский)
  - 🇬🇧 Английский (британский)
  - Самый естественный, энергичный голос.

- onyx:
  - 🇺🇸 Английский / 🇬🇧 Английский
  - Более серьёзный и "официальный" тон.

- echo:
  - 🇫🇷 Французский
  - 🇪🇸 Испанский
  - Нейтральная интонация, мягкое звучание.

- fable:
  - 🇮🇹 Итальянский
  - 🇫🇷 Французский
  - Тёплый оттенок голоса, подходит для романских языков.

- shimmer:
  - 🇪🇸 Испанский (латинский + кастильский)
  - 🇵🇹 Португальский
  - Очень естественное произношение испанского.

- alloy:
  - 🌍 Мульти-языковой (английский, немецкий, голландский)
  - Универсальный, немного "роботизированный", но надёжный.
*/
