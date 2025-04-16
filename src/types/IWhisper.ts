export interface IWhisperHandlerResponse {
  transcription: string
  user_audio_path: string
}

export enum WhisperLocalModelEnum {
  /**
   * 🟢 tiny (~39 MB)
   * 🔹 Очень быстрая, подходит для real-time
   * 🔸 Низкая точность, особенно на длинных предложениях
   * ✅ Поддерживает многоязычность
   */
  TINY = "tiny",

  /**
   * 🟡 base (~74 MB)
   * 🔹 Баланс скорости и качества
   * 🔸 Лучше распознаёт сложные фразы, чем tiny
   */
  BASE = "base",

  /**
   * 🟠 small (~244 MB)
   * 🔹 Значительно выше точность
   * 🔸 Дольше работает на CPU
   * ✅ Поддерживает все языки
   */
  SMALL = "small",

  /**
   * 🟠 medium (~769 MB)
   * 🔹 Очень хорошее качество
   * 🔸 Требует прилично ресурсов
   * 🧠 На GPU летает, на CPU — готовься ждать
   */
  MEDIUM = "medium",

  /**
   * 🔴 large (~1.5 GB)
   * 🔹 Максимальная точность
   * 🔸 OpenAI использует её в API
   * 💀 Работает как поезд — медленно, но надёжно
   */
  LARGE = "large",
}
