import { Router } from "express"

import { CommunicationReviewService } from "../internal/communication_review/impl"
import { createCommunicationReviewRouter } from "../internal/communication_review/router"
import { CommunicationReviewRepository } from "../internal/communication_review/storage/mongo/repository"
import { ConversationService } from "../internal/conversation/impl"
import { createConversationRouter } from "../internal/conversation/router"
import { HistoryRepository } from "../internal/conversation/storage/mongo/repository"
import { ErrorAnalysisService } from "../internal/error_analysis/impl"
import { createErrorAnalysisRouter } from "../internal/error_analysis/router"
import { ErrorAnalysisRepository } from "../internal/error_analysis/storage/mongo/repository"
import { LanguageTheoryService } from "../internal/language_theory/impl"
import { createLanguageTheoryRouter } from "../internal/language_theory/router"
import { OrganisationRepository } from "../internal/organisation/storage/mongo/repository"
import { PromptService } from "../internal/prompts_library/impl"
import { createPromptRouter } from "../internal/prompts_library/router"
import { ScenarioSimulationService } from "../internal/scenario_simulation/impl"
import { createScenarioSimulationRouter } from "../internal/scenario_simulation/router"
import { SessionService } from "../internal/session/impl"
import { createSessionRouter } from "../internal/session/router"
import { SessionRepository } from "../internal/session/storage/mongo/repository"
import { SpeachToTextService } from "../internal/speach_to_text/impl"
import { createSpeachToTextRouter } from "../internal/speach_to_text/router"
import { TaskGeneratorService } from "../internal/task_generator/impl"
import { createTaskGeneratorRouter } from "../internal/task_generator/router"
import { TextAnalysisService } from "../internal/text_analysis/impl"
import { createTextAnalysisRouter } from "../internal/text_analysis/router"
import { TextToSpeachService } from "../internal/text_to_speach/impl"
import { createTextToSpeachRouter } from "../internal/text_to_speach/router"
import { UserRepository } from "../internal/user/storage/mongo/repository"
import { VocabularyTrackerService } from "../internal/vocabulary_tracker/impl"
import { createVocabularyTrackerRouter } from "../internal/vocabulary_tracker/router"
import { VocabularyRepository } from "../internal/vocabulary_tracker/storage/mongo/repository"

// Repositories
const organisationRepo = new OrganisationRepository()
const userRepo = new UserRepository()
const sessionRepo = new SessionRepository()
const vocabularyRepo = new VocabularyRepository()
const errorAnalysisRepository = new ErrorAnalysisRepository()
const historyRepo = new HistoryRepository()
const communicationReviewRepo = new CommunicationReviewRepository()

// Services
const sessionService = new SessionService(sessionRepo)
const speachToTextService = new SpeachToTextService()
const textToSpeachService = new TextToSpeachService()
const textAnalysisService = new TextAnalysisService()
const languageTheoryService = new LanguageTheoryService()
const promptService = new PromptService()
const vocabularyTrackerService = new VocabularyTrackerService(vocabularyRepo, textToSpeachService)
const taskGeneratorService = new TaskGeneratorService(languageTheoryService, textToSpeachService)
const errorAnalysisService = new ErrorAnalysisService(errorAnalysisRepository, languageTheoryService, promptService)
const scenarioSimulationService = new ScenarioSimulationService(textAnalysisService, textToSpeachService, languageTheoryService)
const conversationService = new ConversationService(historyRepo, sessionService, speachToTextService, textAnalysisService, textToSpeachService)
const communicationReviewService = new CommunicationReviewService(communicationReviewRepo, errorAnalysisService, vocabularyTrackerService, conversationService, sessionService, promptService)

const router = Router()

router.use("/session", createSessionRouter(sessionService))
router.use("/scenario-simulation", createScenarioSimulationRouter(scenarioSimulationService))
router.use("/language-theory", createLanguageTheoryRouter(languageTheoryService))
router.use("/vocabulary-tracker", createVocabularyTrackerRouter(vocabularyTrackerService))
router.use("/task-generator", createTaskGeneratorRouter(taskGeneratorService))
router.use("/error-analysis", createErrorAnalysisRouter(errorAnalysisService))
router.use("/speach-to-text", createSpeachToTextRouter(speachToTextService))
router.use("/text-analysis", createTextAnalysisRouter(textAnalysisService))
router.use("/text-to-speach", createTextToSpeachRouter(textToSpeachService))
router.use("/conversation", createConversationRouter(conversationService))
router.use("/communication-review", createCommunicationReviewRouter(communicationReviewService))
router.use("/prompts-library", createPromptRouter(promptService))

export default router
