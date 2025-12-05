# Preview generation

This project includes a helper script to render the EJS views into static HTML files so you can review responsiveness without starting the full server or providing Firebase credentials.

## How it works

- `render_previews.js` reads every `.ejs` file in the `views/` directory and renders it using sample data.
- The generated HTML files are written to `previews/`.
- `public/css/common.css` is copied to `previews/css/styles.css` so the previews include styling.

## Run the preview generator

From the project root (PowerShell on Windows):

```powershell
# install dependencies if not already installed
npm install

# generate previews
node render_previews.js
```

## Open the previews

- Open `previews/index.html` or any `previews/*.html` file in your browser. (There is no `index.html` by default; check the list after running.)
- The files are static and safe to open locally.

## Notes

- The script uses simple sample data and attempts to render all views. Templates that rely on complex runtime variables or includes may render with placeholders or warnings in the terminal.
- If you want different sample data, edit `render_previews.js` and modify the `sampleData` object.

If you want, I can:

- Add the script as an npm script (`npm run render:previews`).
- Improve sample data coverage for specific templates you care about.
- Copy additional static assets (images/icons) into the `previews/` folder for fully offline previews.
