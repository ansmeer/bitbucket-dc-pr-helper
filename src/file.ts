import { prStore } from "./store"
import { PrFile, PullRequest } from "./types"

export const extractFileNameFromLink = (href: string): string => {
	return href.split("diff#")[1].replace(/%2F/g, "/")
}

export const getCurrentFileName = (): string => {
	const fileName = document.querySelector("span.file-breadcrumbs")?.textContent
	if (!fileName) {
		throw new Error("Could not find current file name")
	}
	return fileName
}

const getFileReviewedStatusFromStorage = (fileName: string, prId: string): boolean => {
	const { getState } = prStore
	const currentFile = getState()
		.pullRequests.find((pr) => pr.id === prId)
		?.files.find((f) => f.name === fileName)
	if (!currentFile) {
		throw new Error("Could not retrieve current file from storage")
	}
	return currentFile.reviewed
}

export const getFiles = (): PrFile[] => {
	const listElements = document.querySelectorAll("li.file")
	if (listElements.length === 0) {
		throw new Error("No files found")
	}
	return Array.from(listElements)
		.map((li) => {
			const anchor = li.querySelector("a")
			if (!anchor) return null
			return { name: extractFileNameFromLink(anchor.href), reviewed: false }
		})
		.filter((f) => f !== null)
}

const createEventListenerForToggle = (fileName: string, prId: string) => () => {
	const { getState } = prStore
	getState().toggleReviewedStatus(fileName, prId)
}

const addCheckbox = (fileName: string, prId: string, eventListener: () => void, diffActions: Element) => {
	const checkbox = document.createElement("input")
	checkbox.type = "checkbox"
	checkbox.id = `reviewedCheckbox`
	checkbox.checked = getFileReviewedStatusFromStorage(fileName, prId)
	const label = document.createElement("label")
	label.htmlFor = checkbox.id
	label.textContent = "Reviewed"
	const container = document.createElement("div")
	container.id = "bb-review-toggle"
	container.appendChild(checkbox)
	container.appendChild(label)
	container.addEventListener("mousedown", eventListener)
	diffActions.insertBefore(container, diffActions.firstChild)
}

export const addOrUpdateToggleButtonForCurrentFile = (pullRequest: PullRequest) => {
	const fileName = getCurrentFileName()
	const eventListener = createEventListenerForToggle(fileName, pullRequest.id)
	const changeHeader = document.querySelector("header.change-header")
	const diffActions = changeHeader?.querySelector("div.diff-actions")
	if (!diffActions) {
		throw new Error("Could not find place to insert toggle button")
	}
	const reviewedCheckbox = diffActions.querySelector("#reviewedCheckbox") as HTMLInputElement
	if (reviewedCheckbox) {
		reviewedCheckbox.parentElement?.remove()
	}
	addCheckbox(fileName, pullRequest.id, eventListener, diffActions)
}
