# Bitbucket Pull Request Helper

This Chrome extension allows you to mark individual files or a pull request as reviewed.

## Important notes

- Files that are marked as "reviewed" and are changed later on are not automatically unmarked as reviewed.
- Review-status is only persisted in local storage.
- Host permissions are set to git.vegvesen.no, but you can easily customize it if your Atlassian Bitbucket Data Center
  instance is hosted elsewhere.

## Installation

### From source

To install this extension, you need to load the unpacked extension from source after activating developer mode in
Chrome.
You can find more information here: https://developer.chrome.com/extensions/getstarted

1. Clone this repository
2. Run `npm install`
3. Build the extension with `npm run build`
4. Point the "load unpacked" to the `build` folder in this repository

### From Chrome Web Store

This extension is currently not published on the Chrome Web Store.

## Customization

To allow the extension to run on your self-hosted Bitbucket instance, modify [manifest.json](build/manifest.json)
and [serviceWorker.js](build/serviceWorker.js) accordingly.
