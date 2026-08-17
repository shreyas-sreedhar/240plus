# 240plus

A Chrome extension that puts a button in the X/Twitter compose toolbar. Type past the character limit, press it, and the text is rendered to a card and attached to the post in place of itself — instead of writing it in Notes and screenshotting that.

Experiment. It never went to the Web Store. The shipped version of the *other* direction of this idea (render someone else's tweet, not your own draft) is [Tweet as Image](https://shrys.com/tweet-as-image).

## What it does

- Injects a "Generate Image" control into X's compose toolbar
- Renders the draft to a canvas card
- Builds a real `File`, wraps it in a `DataTransfer`, assigns it to X's file input, and dispatches `change` so their uploader treats it like a disk pick
- Clears the composer by dispatching a synthetic Backspace per character (setting `textContent` does not survive the next React render)
- Re-checks for the button on an interval, because the composer unmounts often enough that a MutationObserver is more trouble than a one-second poll

## Load it

Chrome → `chrome://extensions` → Developer mode → Load unpacked → this folder.

Manifest V3. Host permissions are `twitter.com` and `x.com`. No build step; vanilla JS + Canvas 2D.

## Limit

Pagination is drawn but not wired: the code computes lines per image and an "N/M" counter, then inserts only the first canvas. Genuinely long text overflows one card instead of becoming a thread.
