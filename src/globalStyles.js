const globalStyles = document.createElement('style');

globalStyles.id = "access-settings-css-rules"

globalStyles.innerHTML = /*css*/`
  @font-face {
    font-family: open-dyslexic;
    src: url(https://fonts.cdnfonts.com/s/29616/open-dyslexic.woff);
  }
  :root {
    --access-font-family:open-dyslexic, sans-serif;
    --access-line-height:1.5;
    --access-font-size:16px;
    --access-contrast:100%;
  }
  :root.dyslexic {
    font-family:var(--access-font-family);
    body, header, footer, main, article, section, aside, p {
      font-family:var(--access-font-family) !important;
    }
  }
  :root.lineHeight {
    line-height:var(--access-line-height);
    body, header, footer, main, article, section, aside, p {
      line-height:var(--access-line-height) !important;
    }
  }
  :root.fontSize {
    font-size:var(--access-font-size);
    body, header, footer, main, article, section, aside, p {
      font-size:1rem !important;
    }
  }
  :root.invertedColors {
    &:not(.contrasted) {
      filter:invert(1);
    }
    &.contrasted {
      filter:invert(1) contrast(var(--access-contrast));
    }
  }
  :root.contrasted {
    &:not(.invertedColors) {
      filter:contrast(var(--access-contrast));
    }
  }
  
  @media (prefers-color-scheme: dark) {
    :root:has(access-settings[invert-colors], access-settings[all]) {
      &:not(.contrasted) {
        filter:invert(1);
      }
      &.contrasted {
        filter:invert(1) contrast(var(--access-contrast));
      }
      &.invertedColors {
        &:not(.contrasted) {
          filter:invert(0);
        }
        &.contrasted {
          filter:invert(0) contrast(var(--access-contrast));
        }
      }
    }
  }
`;

document.head.append(globalStyles);