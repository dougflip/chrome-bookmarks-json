Chrome Bookmarks JSON
==================================

Allows you to import bookmarks into a specific folder.

## Purpose

The original idea is that projects should include a `bookmarks.json` file as part of source code.
The bookmarks can be important links within the app, documentation, or anything that is useful to consumers.
This allows everyone to share the same set of bookmarks and keep them versioned and up to date.

This extension is general purpose though and could be used to just share "chunks" of bookmarks as JSON.

## Steps to Install

1. Clone this repo
1. Open Chrome and go to [chrome://extensions/](chrome://extensions/)
1. Check the "Developer Mode" checkbox in the top right
1. Click the "Load unpacked extension" button
1. Select the dir you cloned into from step 1

## Bookmarks.json

The plugin accepts json data representing your bookmarks:

```
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
