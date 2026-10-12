# Bitongue Adventures — Big Button Selector + Learning Lab

A responsive static site with a large-button entry flow: **Grade → Unit → Day → Learning Lab**. The visual language preserves the existing Bitongue palette (navy, turquoise, coral/pink and yellow), rounded cards, progress details and skill workspace. Font Awesome icons are loaded from its CDN.

## Current selector configuration
- Grade 1 / Initial Level → Unit 2 is the currently available sample (Day 1).
- Grade 5 / 5th Level → Unit 1 is the currently available sample (Day 1).
- Other units and days are shown as locked “Coming soon” tiles so the menu does not imply that their content is already built.
- To add a new day, update the selector configuration in `app.js` when that day's content is ready.

## Existing Learning Lab
- Vocabulary: links to the two supplied Quizlet sets.
- Reading: uses the supplied “A Healthy Lifestyle” and “A Special Day” worksheets.
- Listening: includes the three supplied YouTube resources.
- Speaking, Writing, Grammar and Entrepreneurship: editable learning structures.

## Run / publish
Open `index.html` in a browser, or publish this folder using GitHub Pages. No build step is required.

## Next incremental work
Add one day at a time. Keep the shared selector and learning shell stable; add each day’s content as a separate module/data file when the user provides the next prompt.
