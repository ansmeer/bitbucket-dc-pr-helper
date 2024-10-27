import { prStore } from "./store"
import { PrFile } from "./types"

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

const getFileReviewedStatusFromStorage = (fileName: string, prId: number): boolean => {
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

const addCheckbox = (fileName: string, prId: number, eventListener: () => void, diffActions: Element) => {
	const checkbox = document.createElement("input")
	checkbox.type = "checkbox"
	checkbox.id = `reviewedCheckbox`
	checkbox.checked = getFileReviewedStatusFromStorage(fileName, prId)
	const label = document.createElement("label")
	label.htmlFor = checkbox.id
	label.textContent = "Reviewed"
	const container = document.createElement("div")
	container.appendChild(checkbox)
	container.appendChild(label)
	container.addEventListener("mousedown", eventListener)
	diffActions.insertBefore(container, diffActions.firstChild)
}

export const addOrUpdateToggleButtonForCurrentFile = (fileName: string, prId: number, eventListener: () => void) => {
	const changeHeader = document.querySelector("header.change-header")
	const diffActions = changeHeader?.querySelector("div.diff-actions")
	if (!diffActions) {
		throw new Error("Could not find place to insert toggle button")
	}
	const reviewedCheckbox = diffActions.querySelector("#reviewedCheckbox") as HTMLInputElement
	if (reviewedCheckbox) {
		reviewedCheckbox.parentElement?.remove()
	}
	addCheckbox(fileName, prId, eventListener, diffActions)
}
