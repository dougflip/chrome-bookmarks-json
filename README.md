# Chrome Bookmarks JSON

Allows you to import bookmarks into a specific folder.

## Purpose

The original idea is that projects should include a `bookmarks.json` file as part of source code.
The bookmarks can be important links within the app, documentation, or anything that is useful to consumers.
This allows everyone to share the same set of bookmarks and keep them versioned and up to date.

This extension is general purpose though and could be used to just share "chunks" of bookmarks as JSON.

## Local Development

You can develop locally via Docker.

```bash
./scripts/dev
```

This will start a Bash session **inside a container** with dependencies installed
and the local source code mounted as a volume.

You can immediately run commands from this prompt.
As an example try running:

```bash
npm run build
```

You can edit code on your local machine and re-run the command above (or any other command).
The intent is to _edit_ code from your local machine
and _operate_ on the code from within the container (compile etc.).

When you are done you can exit the container with `ctrl + d`.

## Building and Installing (as a Chrome extension)

1. `./scripts/dev npm run build` - build code into `./dist` dir
2. Open Chrome and go to [chrome://extensions/](chrome://extensions/)
3. Check the "Developer Mode" checkbox in the top right
4. Click the "Load unpacked extension" button
5. Select the `./dist` directory created in step 1

See
[Load an unpacked extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/#unpacked)
for more details.

## Bookmarks.json

The plugin accepts json data representing your bookmarks:

```json
[{
    "title": "bookmark",
    "url": "http://www.url.com"
}, {
    "title": "folder",
    "children": [
        { "title": "child-bookmark", "url": "http://www.another-url.com" }
    ]
}]
```

Basically, a folder is a `title` and `children` and a bookmark is a `title` and `url`.
You can nest these arbitrarily deep.

## Development without Docker

If you prefer to develop "on the metal" I would recommend
using NVM.

1. [Install nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
2. `nvm use`
3. `npm install`

## TODO

[ ] Use Zod to validate user provided JSON
[ ] Build for browsers other than Chrome
