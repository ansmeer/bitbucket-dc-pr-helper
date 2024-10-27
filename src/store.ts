import { createStore } from "zustand/vanilla"
import { persist, subscribeWithSelector } from "zustand/middleware"
import { PrStore, PullRequest } from "./types"

export const prStore = createStore<PrStore>()(
	persist(
		subscribeWithSelector((set, get) => ({
			pullRequests: [],
			addOrUpdateStoredPullRequest: (pullRequest) => {
				if (prExists(pullRequest, get().pullRequests)) {
					set((state) => ({ pullRequests: updatePullRequest(pullRequest, state) }))
				} else {
					set((state) => ({ pullRequests: [...state.pullRequests, pullRequest] }))
				}
			},
			toggleReviewedStatus: (fileName, prId) => {
				const pr = getPrById(prId, get())
				if (!pr) {
					throw new Error(`Could not find PR ${prId} to toggle reviewed status for file ${fileName}`)
				}
				const updatedPr = {
					...pr,
					files: pr.files.map((f) => {
						if (f.name === fileName) {
							f.reviewed = !f.reviewed
						}
						return f
					}),
				}
				get().addOrUpdateStoredPullRequest(updatedPr)
			},
		})),
		{ name: "pr-store" },
	),
)

const prExists = (pullRequest: PullRequest, allPullRequests: PullRequest[]): boolean => {
	return allPullRequests.map((pr) => pr.id).includes(pullRequest.id)
}

const getPrById = (id: number, state: PrStore): PullRequest | undefined => {
	return state.pullRequests.find((pr) => pr.id === id)
}

const updatePullRequest = (pullRequest: PullRequest, state: PrStore): PullRequest[] => {
	const storedPullRequest = getPrById(pullRequest.id, state)

	storedPullRequest?.files.forEach((oldFile) => {
		const newFile = pullRequest.files.find((f) => f.name === oldFile.name)

		if (newFile) {
			newFile.reviewed = oldFile.reviewed
		}
	})

	const otherPrs = state.pullRequests.filter((pr) => pr.id !== pullRequest.id)

	return [...otherPrs, pullRequest]
}
