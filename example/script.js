hljs.highlightAll();

const access = document.createElement("access-settings");
access.setAttribute("all","");
document.body.append(access);

function removeAttributes() {
  for (const attr of access.attributes) {
    access.removeAttribute(attr.name);
  }
}

function handleIntersect(entries, observer) {
  entries.forEach(entry => {
    
    if (!entry.isIntersecting) return;
    const { id } = entry.target;
     
    switch (id) {
      case "install":
        access.open = false;
        break;
      case "all":
        removeAttributes();
        access.setAttribute("all", "");
        access.open = true;break;
      case "dyslexic-font":
        removeAttributes();
        access.setAttribute("dyslexic-font", "");
        break;
      case "invert-colors":
        removeAttributes();
        access.setAttribute("invert-colors", "");
        break;
      case "contrast":
        removeAttributes();
        access.setAttribute("contrast", "");
        break;
      case "font-size":
        removeAttributes();
        access.setAttribute("font-size", "");
        break;
      case "line-height":
        removeAttributes();
        access.setAttribute("line-height", "");
        break;
    }
  });
}

let options = {
  root: null,
  rootMargin: "-40% 0px -50% 0px"
};

const observer = new IntersectionObserver(handleIntersect, options);

for (const section of document.querySelectorAll("main section[id]")) {
  observer.observe(section);
}