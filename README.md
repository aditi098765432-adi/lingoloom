# LingoLoom — Language Learning App

A responsive beginner-friendly language learning web app built with HTML, CSS and vanilla JavaScript.

## Features
- Spanish, French and German vocabulary sets
- Flashcards with show/hide translations
- Browser speech pronunciation (uses the browser's Speech Synthesis voices)
- Save vocabulary words
- Daily lesson completion tracking
- Five-question practice quiz with score and personal best
- Daily goal tracker
- Progress saved locally with `localStorage`
- Responsive desktop and mobile layout

## Run locally
1. Download or clone this repository.
2. Open the folder in Visual Studio Code.
3. Open `index.html` in a browser, or use the VS Code Live Server extension.
4. Choose a language and start learning.

No build tools or backend setup are required. Progress is stored in the current browser on the current device.

## Publish with GitHub Pages
1. Create a new public GitHub repository named `lingoloom`.
2. Upload `index.html`, `style.css`, `script.js`, and this README to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select **main** and **/(root)**, then click **Save**.
6. Wait for GitHub Pages to publish. Your site URL will look like:
   `https://YOUR-USERNAME.github.io/lingoloom/`

## Notes
- This is a front-end project. User progress is saved in local browser storage, as permitted by the task brief.
- Speech pronunciation depends on browser/device voice availability.
- Google Fonts are loaded online; system fonts will be used if offline.
