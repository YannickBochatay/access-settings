hljs.highlightAll();

const access = document.createElement("access-settings");
access.setAttribute("all","");
document.body.append(access);

const sections = document.querySelectorAll("main section[id]");

function removeAttributes() {
  for (const attr of access.attributes) {
    access.removeAttribute(attr.name);
  }
}
function select(selected) {
  for (let section of sections) {
    if (selected === section) section.classList.add("selected");
    else section.classList.remove("selected");
  }
}

function handleIntersect(entries, observer) {
  entries.forEach(entry => {
    
    if (!entry.isIntersecting) return;
    const { id } = entry.target;

    select(entry.target);
    removeAttributes();
    document.documentElement.lang = "fr";
    access.open = true;
     
    switch (id) {
      case "install":
        access.open = false;
        break;
      case "all":
        access.setAttribute("all", "");
        break;
      case "dyslexic-font":
        access.setAttribute("dyslexic-font", "");
        break;
      case "invert-colors":
        access.setAttribute("dyslexic-font", "");
        access.setAttribute("invert-colors", "");
        break;
      case "contrast":
        access.setAttribute("dyslexic-font", "");
        access.setAttribute("invert-colors", "");
        access.setAttribute("contrast", "");
        break;
      case "font-size":
        access.setAttribute("dyslexic-font", "");
        access.setAttribute("invert-colors", "");
        access.setAttribute("contrast", "");
        access.setAttribute("font-size", "");
        break;
      case "line-height":
        access.setAttribute("dyslexic-font", "");
        access.setAttribute("invert-colors", "");
        access.setAttribute("contrast", "");
        access.setAttribute("font-size", "");
        access.setAttribute("line-height", "");
        break;
      case "side":
        access.setAttribute("all", "");
        access.setAttribute("side", "left");
        break;
      case "rounded":
        access.setAttribute("all", "");
        access.setAttribute("rounded", "");
        break;
      case "lang":
        access.setAttribute("all", "");
        document.documentElement.lang = "en";
    }
  });
}

let options = {
  root: null,
  rootMargin: "-40% 0px -60% 0px"
};

const observer = new IntersectionObserver(handleIntersect, options);

for (const section of sections) {
  observer.observe(section);
}