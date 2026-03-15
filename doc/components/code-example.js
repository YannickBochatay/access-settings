import hljs from "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/es/highlight.min.js"

const template = document.createElement("template");

template.innerHTML = `
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/a11y-light.min.css">
  <style>
    :host {
      display:block;

      & > div {
        overflow-x:auto;

        pre {
          margin:0;

          code.hljs {
            box-sizing:border-box;
            min-width:100%;
            width:fit-content;
          }
        }
      }
    }
  </style>
  <div tabindex="0">
    <pre><code class="language-xxx"></code></pre>
  </div>
  <slot></slot>
`

class CodeExample extends HTMLElement {

  constructor() {
    super();
    const root = this.attachShadow({ mode : "open" });
    root.append(template.content.cloneNode(true));
  }

  get language() {
    return this.getAttribute("language");
  }

  connectedCallback() {
    const code = this.shadowRoot.querySelector("code");
    const slot = this.shadowRoot.querySelector("slot");    
    code.className = code.className.replace("xxx", this.language);
    code.append(...slot.assignedNodes());
    slot.remove();
    hljs.highlightElement(code);
  }
}

customElements.define("code-example", CodeExample);