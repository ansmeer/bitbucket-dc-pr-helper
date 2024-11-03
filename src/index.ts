import { prStore } from "./store"
import { addOrUpdateToggleButtonForCurrentFile } from "./file"
import { getCurrentPrId, parseCurrentPullRequest } from "./pullRequest"
import { addStatusToTree } from "./tree"
import { addOrUpdatePrOverview } from "./overview"

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

	addOrUpdateToggleButtonForCurrentFile(pullRequest)
	addStatusToTree(pullRequest)
	addOrUpdatePrOverview(pullRequest)
}, 100)

prStore.subscribe(
	(state) => state.pullRequests,
	(pullRequests) => {
		const currentPrId = getCurrentPrId()
		const currentPr = pullRequests.find((pr) => pr.id === currentPrId)
		if (currentPr) {
			addOrUpdateToggleButtonForCurrentFile(currentPr)
			addStatusToTree(currentPr)
			addOrUpdatePrOverview(currentPr)
		}
	},
)
