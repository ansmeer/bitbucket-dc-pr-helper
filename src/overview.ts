import { PullRequest } from "./types"
import { prStore } from "./store"

export const addOrUpdatePrOverview = (pullRequest: PullRequest) => {
	const reviewedFiles = pullRequest.files.filter((f) => f.reviewed)
	const statusPercentage = Math.round((reviewedFiles.length / pullRequest.files.length) * 100)
	const isPrCompleted = reviewedFiles.length === pullRequest.files.length
	const changesToolbar = document.querySelector("div.changes-scope-toolbar")
	if (!changesToolbar) {
		throw new Error("Could not find changes toolbar")
	}

	const overviewId = "bb-overview"
	const textContent = `Reviewed ${reviewedFiles.length} of ${pullRequest.files.length} files (${statusPercentage}%)`
	const existingOverviewElement = document.querySelector(`#${overviewId}`)
	if (existingOverviewElement) {
		existingOverviewElement.textContent = textContent
		existingOverviewElement.className = isPrCompleted ? "complete" : "incomplete"
	} else {
		const overviewElement = document.createElement("div")
		overviewElement.id = overviewId
		overviewElement.className = isPrCompleted ? "complete" : "incomplete"
		overviewElement.textContent = `reviewed ${reviewedFiles.length} of ${pullRequest.files.length} files (${statusPercentage}%)`

		const unmarkAll = document.createElement("button")
		unmarkAll.textContent = "Reset"
		unmarkAll.title = "Reset all files to not reviewed"
		unmarkAll.className = "bb-reset"
		unmarkAll.addEventListener("mousedown", () => prStore.getState().unmarkAllAsReviewed(pullRequest))

		const wrapper = document.createElement("div")
		wrapper.className = "bb-overview-wrapper"
		wrapper.appendChild(overviewElement)
		wrapper.appendChild(unmarkAll)
		changesToolbar.insertBefore(wrapper, changesToolbar.firstChild)
	}
}
