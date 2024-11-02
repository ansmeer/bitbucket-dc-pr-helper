import { PullRequest } from "./types"
import { getFiles } from "./file"

const getPrNumber = (location: string): string => {
	const regex = /pull-requests\/(\d+)\//
	const match = location.match(regex)
	const id = match ? match[1] : null
	if (id === null) {
		throw new Error("Could not find PR id")
	}
	return id
}

const getPrProjectName = (location: string): string => {
	const regex = /projects\/([a-zA-Z0-9\-]+)\//
	const match = location.match(regex)
	const project = match ? match[1] : null
	if (!project) {
		throw new Error("Could not find project name")
	}
	return project
}

const getPrRepoName = (location: string): string => {
	const regex = /repos\/([a-zA-Z0-9\-]+)\//
	const match = location.match(regex)
	const repo = match ? match[1] : null
	if (!repo) {
		throw new Error("Could not find repository name")
	}
	return repo
}

export const getCurrentPrId = (): string => {
	const location = window.location.href

	const number = getPrNumber(location)
	const projectName = getPrProjectName(location)
	const repoName = getPrRepoName(location)

	return `${projectName}-${repoName}-${number}`
}

export const parseCurrentPullRequest = (): PullRequest => {
	return {
		id: getCurrentPrId(),
		files: getFiles(),
	}
}
