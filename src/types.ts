export type PrFile = {
	name: string
	reviewed: boolean
}

export type PullRequest = {
	id: string
	files: PrFile[]
}

export type PrStore = {
	pullRequests: PullRequest[]
	addOrUpdateStoredPullRequest: (pullRequest: PullRequest) => void
	toggleReviewedStatus: (fileName: string, prId: string) => void
	unmarkAllAsReviewed: (pullRequest: PullRequest) => void
}
