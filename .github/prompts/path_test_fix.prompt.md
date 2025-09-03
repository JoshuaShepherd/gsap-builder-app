---
mode: agent
---
path_test/page.tsx is completely wrong.

Without breaking or deleting anything else, here's what I want.

Upon entry to the page, no paths for content shoudl be visible. Under the nav, a blank white screen appears.

Immediately upon scroll. The first 4 paths should begin to be drawn. 

Then, as the user continues to scroll down to 1600px, the next 4 paths should be drawn, and so on, until all paths have been animated.

The remaining 3 sets of paths should be drawn when the user gets to the pixel position for those.

I believe that is clear in the paths, but you need to fix this so that the paths are relative to the full width of the viewport and start at the top of the page.

Turn this into a checklist.

Consult the GSAP guide for any help you need.
