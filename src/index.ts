import { prStore } from "./store"
import { addOrUpdateToggleButtonForCurrentFile, getCurrentFileName } from "./file"
import { getCurrentPullRequest } from "./pullRequest"
import { addStatusToTree } from "./tree"
import { addOrUpdatePrOverview } from "./overview"

const createEventListenerForToggle = (fileName: string, prId: number) => () => {
	const { getState } = prStore
	getState().toggleReviewedStatus(fileName, prId)
}

const findCurrentPrInterval = setInterval(() => {
	const pullRequest = getCurrentPullRequest()

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
