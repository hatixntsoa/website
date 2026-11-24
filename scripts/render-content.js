// Renders the page title, navbar, greeting and description from SITE_CONTENT.
(function () {
  var content = window.SITE_CONTENT;
  if (!content) return;

  function createLink(text, href) {
    var a = document.createElement("a");
    a.textContent = text;
    a.href = href;
    if (href.indexOf("mailto:") !== 0) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    return a;
  }

  document.title = content.name;

  var nav = document.getElementById("topbar-links");
  if (nav) {
    content.navLinks.forEach(function (item) {
      nav.appendChild(createLink("[" + item.label + "]", item.href));
    });
  }

  var greeting = document.getElementById("profile-greeting");
  if (greeting) greeting.textContent = content.greeting;

  var copy = document.getElementById("profile-copy");
  if (copy) {
    content.description.forEach(function (segments) {
      var p = document.createElement("p");
      segments.forEach(function (segment) {
        if (typeof segment === "string") {
          p.appendChild(document.createTextNode(segment));
        } else {
          p.appendChild(createLink(segment.text, segment.href));
        }
      });
      copy.appendChild(p);
    });
  }
})();
