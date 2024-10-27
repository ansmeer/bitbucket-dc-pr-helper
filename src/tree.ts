import { PrFile, PullRequest } from "./types"
import { extractFileNameFromLink } from "./file"

const addClassForFile = (file: PrFile, anchors: HTMLAnchorElement[]) => {
	const fileLink = anchors.find((a) => extractFileNameFromLink(a.href) === file.name)
	if (!fileLink) {
		throw new Error("Could not find link element for file in PR")
	}
	if (file.reviewed) {
		fileLink.className = "bb-reviewed"
	} else {
		fileLink.className = "bb-not-reviewed"
	}
}

const getTreeAnchors = (): HTMLAnchorElement[] => {
	const tree = document.querySelector("div.changes-tree")
	if (!tree) {
		throw new Error("Could not find tree to add file status")
	}
	const anchors = Array.from(tree.querySelectorAll("a"))
	if (anchors.length === 0) {
		throw new Error("Could not find any links in the tree to add file status")
	}
	return anchors
}

export const addStatusToTree = (pr: PullRequest) => {
	pr.files.forEach((file) => addClassForFile(file, getTreeAnchors()))
}
