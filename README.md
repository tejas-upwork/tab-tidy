# 🧹 Tab Tidy — Chrome Extension (Manifest V3)

![version](https://img.shields.io/badge/version-1.0.0-blue)
![manifest](https://img.shields.io/badge/Manifest-V3-orange)
![chrome](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)
![license](https://img.shields.io/badge/license-MIT-green)

> A lightweight Chrome extension that finds **duplicate tabs** and closes
> them in one click — while keeping your pinned and active tabs safe.

## 📖 What is this?

Browser tab overload is real. Tab Tidy scans every open tab, groups the ones
pointing at the **same URL**, and closes the duplicates — leaving one copy of
each page plus everything you pinned or are currently viewing.

## ✨ Features

- 🔍 **Duplicate detection** across all windows (same URL = duplicate)
- 📌 **Pinned tabs are never touched**
- 👁️ **Active tab is never closed**
- 🔢 **Count preview** — see how many duplicates will close before you confirm
- ⚡ **One-click cleanup** from the toolbar popup
- 🔒 **Private by design** — no data collection, no network calls, no tracking

## 🛠️ How it works

1. Click the Tab Tidy icon → the popup opens (`popup.html` / `popup.js`).
2. The script calls `chrome.tabs.query({})` to list every open tab.
3. Tabs are grouped by normalized URL; groups with 2+ tabs are duplicates.
4. Within each group it keeps the **first** tab and closes the rest —
   skipping any tab that is **pinned** or **currently active**.
5. The popup shows the duplicate count and a single **"Close duplicates"**
   button.

Only permission requested: `"tabs"` (needed to list tab URLs).

## 🚀 Install

**Developer mode (2 minutes):**

1. Open `chrome://extensions`
2. Enable **Developer mode** (toggle, top right)
3. Click **Load unpacked**
4. Select the `tab-tidy-extension` folder
5. Pin **Tab Tidy** to the toolbar and click it to clean up

## 📁 Project structure

```
tab-tidy-extension/
├── manifest.json      # Manifest V3 config (name, version, permissions)
├── popup.html         # popup UI
├── popup.js           # duplicate detection + close logic
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── README.md
└── LICENSE
```

## 📄 Version

**v1.0.0** — initial release: duplicate detection, pinned/active-tab
protection, count preview, one-click cleanup.

## 📝 License

MIT — see [LICENSE](LICENSE).
