// Renders the copyright line and the social icons.
(function () {
  var content = window.SITE_CONTENT;
  if (!content) return;

  var copyright = document.getElementById("footer-copyright");
  if (copyright) {
    copyright.textContent =
      "\u00A9 " + new Date().getFullYear() + " " + content.name;
  }

  var container = document.getElementById("footer-socials");
  if (!container) return;

  var NS = "http://www.w3.org/2000/svg";

  content.socials.forEach(function (social) {
    var a = document.createElement("a");
    a.className = "social";
    a.href = social.href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.title = social.name;
    a.setAttribute("aria-label", social.name + " profile");

    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", social.viewBox);
    svg.setAttribute("fill", "currentColor");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    var path = document.createElementNS(NS, "path");
    path.setAttribute("d", social.path);
    if (social.evenodd) {
      path.setAttribute("fill-rule", "evenodd");
      path.setAttribute("clip-rule", "evenodd");
    }

    svg.appendChild(path);
    a.appendChild(svg);
    container.appendChild(a);
  });
})();
