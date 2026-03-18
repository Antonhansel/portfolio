// custom typefaces
import "typeface-montserrat"
import "typeface-merriweather"
import "@fontsource/caveat"
// normalize CSS across browsers
import "./src/normalize.css"
// custom CSS styles
import "./src/style.css"

// Highlighting for code blocks
import "prismjs/themes/prism.css"

// Unregister stale service worker from removed gatsby-plugin-offline
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js")
}
