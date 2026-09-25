# Tab Tidy — Chrome Extension (Manifest V3)

A lightweight Chrome extension that finds duplicate tabs and closes them,
keeping your pinned and active tabs safe. Built as a portfolio sample.

## Features

- Scans all open tabs for duplicates (same URL)
- Preserves pinned tabs and the currently active tab
- One-click cleanup from the popup
- Shows duplicate count before closing

## Tech

- Chrome Extensions Manifest V3
- Vanilla JavaScript, HTML, CSS
- No dependencies, no data collection

## Install (developer mode)

1. Open `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked** and select the `tab-tidy-extension` folder
4. Click the Tab Tidy icon in the toolbar to use it

## Files

- `manifest.json` — extension manifest (MV3)
- `popup.html` / `popup.js` — popup UI and logic
- `icons/` — extension icons (16 / 48 / 128 px)

## Note

Sample / spec work created for portfolio purposes.
