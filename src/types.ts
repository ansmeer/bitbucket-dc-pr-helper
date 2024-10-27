export type PrFile = {
	name: string
	reviewed: boolean
}

export type PullRequest = {
	id: number
	files: PrFile[]
}

export type PrStore = {
	pullRequests: PullRequest[]
	addOrUpdateStoredPullRequest: (pullRequest: PullRequest) => void
	toggleReviewedStatus: (fileName: string, prId: number) => void
}
