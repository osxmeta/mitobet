/* MITOBET Loader */
(function() {
    var V = "v1";
    var BASE = "https://cdn.jsdelivr.net/gh/osxmeta/mitobet@main/dist/" + V;

    // CSS yukle
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = BASE + "/bundle.css";
    document.head.appendChild(link);

    // JS yukle
    var script = document.createElement("script");
    script.src = BASE + "/bundle.js";
    document.body.appendChild(script);
})();
