const mainUl = document.querySelector("details nav ul");

function addItems(level, sections, parent) {

  for (const section of sections) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#" + section.id;
    a.textContent = section.querySelector(`h${level}`).textContent;
    li.append(a);
    parent.append(li);
    const subSections = section.querySelectorAll(`section[id]:has(h${level+1})`)
    if (subSections?.length) {
      const ul = document.createElement("ul");
      li.append(ul)
      addItems(level + 1, subSections, ul);
    }
  }

}

const sections = document.querySelectorAll("section[id]:has(h2)");
addItems(2, sections, mainUl)
