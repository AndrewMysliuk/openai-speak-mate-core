import { ILanguageTheory } from ".."
import language_theory_bg_json from "../../../json_data/language_theory_bg.json"
import language_theory_de_json from "../../../json_data/language_theory_de.json"
import language_theory_en_json from "../../../json_data/language_theory_en.json"
import language_theory_es_json from "../../../json_data/language_theory_es.json"
import { ILanguageTopic, VocabularyFrequencyLevelEnum } from "../../../types"
import { createScopedLogger } from "../../../utils"

const log = createScopedLogger("LanguageTheoryService")

export class LanguageTheoryService implements ILanguageTheory {
  async list(): Promise<ILanguageTopic[]> {
    try {
      return language_theory_en_json as ILanguageTopic[]
    } catch (error: unknown) {
      log.error("list", "error", { error })
      throw error
    }
  }

  async listByLanguage(language: string): Promise<ILanguageTopic[]> {
    try {
      let records: ILanguageTopic[] = []

      switch (language) {
        case "en":
          records = language_theory_en_json as ILanguageTopic[]
          break
        case "de":
          records = language_theory_de_json as ILanguageTopic[]
          break
        case "es":
          records = language_theory_es_json as ILanguageTopic[]
          break
        case "bg":
          records = language_theory_bg_json as ILanguageTopic[]
          break

        default:
          throw new Error()
      }

      return records.filter((item) => item.language.toLowerCase() === language.toLowerCase())
    } catch (error: unknown) {
      log.error("listByLanguage", "error", { error })
      throw error
    }
  }

  async filteredShortListByLanguage(language: string, filters: { topic_ids?: string[]; topic_titles?: string[]; level_cefr?: VocabularyFrequencyLevelEnum[] }): Promise<ILanguageTopic[]> {
    try {
      const topics = await this.listByLanguage(language)

      const { topic_ids, topic_titles, level_cefr } = filters
      const hasTopicIds = topic_ids && topic_ids.length > 0
      const hasTopicTitles = topic_titles && topic_titles.length > 0
      const hasLevelCEFR = level_cefr && level_cefr.length > 0

      const filtered = topics.filter(
        (t) => (!hasTopicIds || topic_ids!.includes(t.id)) && (!hasTopicTitles || topic_titles!.includes(t.title)) && (!hasLevelCEFR || level_cefr!.includes(t.cefr_level)),
      )

      return filtered.map(({ id, language, cefr_level, title }) => ({ id, language, cefr_level, title })) as ILanguageTopic[]
    } catch (error: unknown) {
      log.error("filteredShortListByLanguage", "error", { error })
      throw error
    }
  }
}
