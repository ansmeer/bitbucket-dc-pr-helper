import { prStore } from "./store"
import { addOrUpdateToggleButtonForCurrentFile, getCurrentFileName } from "./file"
import { parseCurrentPullRequest } from "./pullRequest"
import { addStatusToTree } from "./tree"
import { addOrUpdatePrOverview } from "./overview"

const createEventListenerForToggle = (fileName: string, prId: string) => () => {
	const { getState } = prStore
	getState().toggleReviewedStatus(fileName, prId)
}

let attemptCount = 0
const findCurrentPrInterval = setInterval(() => {
	attemptCount++
	if (attemptCount >= 20) {
		clearInterval(findCurrentPrInterval)
	}

	const pullRequest = parseCurrentPullRequest()

	if (pullRequest.files.length > 0) {
		clearInterval(findCurrentPrInterval)
	}

	const { getState } = prStore
	getState().addOrUpdateStoredPullRequest(pullRequest)

	const currentFileName = getCurrentFileName()
	const eventListener = createEventListenerForToggle(currentFileName, pullRequest.id)
	addOrUpdateToggleButtonForCurrentFile(currentFileName, pullRequest.id, eventListener)
	addStatusToTree(pullRequest)
	addOrUpdatePrOverview(pullRequest)
}, 100)
