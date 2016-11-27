module.exports = {
  build: {
    "index.html": "index.html",
    "contracklist.html": "contracklist.html",
    "app.js": [
      "javascripts/app.js"
    ],
    "jquery.js": [
      "javascripts/jquery-3.1.1.min.js"
    ],
    "app.css": [
      "stylesheets/app.css"
    ],
    "images/": "images/"
  },
  rpc: {
    host: "localhost",
    port: 8545
  }
};
