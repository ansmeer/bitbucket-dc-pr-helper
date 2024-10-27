import { PullRequest } from "./types"
import { getFiles } from "./file"

const getPrId = (): number => {
	const location = window.location.href
	const regex = /pull-requests\/(\d+)\//
	const match = location.match(regex)
	const id = match ? match[1] : null
	if (id === null) {
		throw new Error("Could not find PR id")
	}
	return parseInt(id)
}

export const getCurrentPullRequest = (): PullRequest => {
	return {
		id: getPrId(),
		files: getFiles(),
	}
}
