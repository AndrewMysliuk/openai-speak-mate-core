export enum TaskTypeEnum {
  FILL_BLANK = "FILL_BLANK",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
}

export enum TaskModeEnum {
  WRITE = "WRITE",
  SELECT = "SELECT",
}

export interface IFillBlankSentence {
  id: number // uuid или просто порядковый
  prompt: string // предложение с пропущенным словом, например: "He ___ to school every day."
  answer: string // правильный ответ: "goes"
  explanation?: string // почему именно так
}

export interface IMultipleChoiceSentence {
  id: number
  prompt: string // "He ___ to school every day."
  options: string[] // ["go", "goes", "gone"]
  answer: string // "goes"
  explanation?: string
}

export interface IFillBlankTask {
  sentences: IFillBlankSentence[]
}

export interface IMultipleChoiceTask {
  sentences: IMultipleChoiceSentence[]
}

export interface IGenericTask<T = IFillBlankTask | IMultipleChoiceTask> {
  id: string // Уникальный ID задания
  type: TaskTypeEnum // Тип задания (fill_blank, multiple_choice, и т.д.)
  mode: TaskModeEnum
  topic_title: string
  target_language: string
  explanation_language: string
  task: T
}

export interface ITaskGeneratorRequest {
  // user_id: string
  // organization_id: string
  session_id: string
  topic_title: string
  type: TaskTypeEnum // например: "fill_blank", "multiple_choice" и т.д.
  mode: TaskModeEnum
  target_language: string
  explanation_language: string
  task_sentences_count: number
}
