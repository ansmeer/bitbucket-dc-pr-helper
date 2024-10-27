import { PullRequest } from "./types"
import { prStore } from "./store"
import { getCurrentPrId } from "./pullRequest"

prStore.subscribe(
	(state) => state.pullRequests,
	(pullRequests) => {
		const currentPrId = getCurrentPrId()
		const currentPr = pullRequests.find((pr) => pr.id === currentPrId)
		if (currentPr) {
			addOrUpdatePrOverview(currentPr)
		}
	},
)

export const addOrUpdatePrOverview = (pullRequest: PullRequest) => {
	const reviewedFiles = pullRequest.files.filter((f) => f.reviewed)
	const statusPercentage = Math.round((reviewedFiles.length / pullRequest.files.length) * 100)

	const changesToolbar = document.querySelector("div.changes-scope-toolbar")
	if (!changesToolbar) {
		throw new Error("Could not find changes toolbar")
	}

	const overviewId = "bb-overview"
	const textContent = `Reviewed ${reviewedFiles.length} of ${pullRequest.files.length} files (${statusPercentage}%)`
	const overviewDiv = document.querySelector(`#${overviewId}`)
	if (overviewDiv) {
		overviewDiv.textContent = textContent
	} else {
		const overviewParent = document.createElement("div")
		overviewParent.id = overviewId
		overviewParent.textContent = `reviewed ${reviewedFiles.length} of ${pullRequest.files.length} files (${statusPercentage}%)`
		changesToolbar.insertBefore(overviewParent, changesToolbar.firstChild)
	}
}
