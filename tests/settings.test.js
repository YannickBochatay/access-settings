import { settings } from "../src/settings/index.js";

QUnit.module('change state', hooks => {

  const root = document.documentElement;
  const style = getComputedStyle(root);

  hooks.before(() => settings.reset());
  hooks.after(() => settings.reset());

  QUnit.test("change font", assert => {
    assert.strictEqual(root.classList.contains("dyslexicFont"), false);

    settings.dyslexicFont = true;
    assert.strictEqual(root.classList.contains("dyslexicFont"), true);
    assert.strictEqual(style.fontFamily.includes("open-dyslexic"), true);

    settings.dyslexicFont = false;
    assert.strictEqual(root.classList.contains("dyslexicFont"), false);
    assert.strictEqual(style.fontFamily.includes("open-dyslexic"), false);
  });

  QUnit.test("change colors", assert => {
    assert.strictEqual(root.classList.contains("invertColors"), false);
    assert.strictEqual(style.filter.includes("invert(1)"), false);

    settings.invertColors = true;
    assert.strictEqual(root.classList.contains("invertColors"), true);
    assert.strictEqual(style.filter.includes("invert(1)"), true);

    settings.invertColors = false;
    assert.strictEqual(root.classList.contains("invertColors"), false);
    assert.strictEqual(style.filter.includes("invert(1)"), false);
  });

  QUnit.test("change contrast", assert => {
    assert.strictEqual(root.classList.contains("contrast"), false);
    assert.strictEqual(style.filter.includes("contrast(1)"), false);

    settings.contrast = 120;
    assert.strictEqual(root.classList.contains("contrast"), true);
    assert.strictEqual(root.style.getPropertyValue("--access-contrast"), "120%");
    assert.strictEqual(style.filter.includes("contrast(1.2)"), true);

    settings.contrast = 100;
    assert.strictEqual(root.classList.contains("contrast"), true);
    assert.strictEqual(root.style.getPropertyValue("--access-contrast"), "100%");
    assert.strictEqual(style.filter.includes("contrast(1)"), true);
  });

  QUnit.test("change font size", assert => {
    assert.strictEqual(root.classList.contains("fontSize"), false);
    assert.strictEqual(style.fontSize, "16px");

    settings.fontSize = 18;
    assert.strictEqual(root.classList.contains("fontSize"), true);
    assert.strictEqual(root.style.getPropertyValue("--access-font-size"), "18px");
    assert.strictEqual(style.fontSize, "18px");

    settings.fontSize = 16;
    assert.strictEqual(root.classList.contains("fontSize"), true);
    assert.strictEqual(root.style.getPropertyValue("--access-font-size"), "16px");
    assert.strictEqual(style.fontSize, "16px");
  });

  QUnit.test("change line height", assert => {
    assert.strictEqual(root.classList.contains("lineHeight"), false);
    assert.strictEqual(style.lineHeight, "normal");

    settings.lineHeight = 2;
    assert.strictEqual(root.classList.contains("lineHeight"), true);
    assert.strictEqual(root.style.getPropertyValue("--access-line-height"), "2");
    assert.strictEqual(style.lineHeight, "32px");

    settings.lineHeight = 1.5;
    assert.strictEqual(root.classList.contains("lineHeight"), true);
    assert.strictEqual(root.style.getPropertyValue("--access-line-height"), "1.5");
    assert.strictEqual(style.lineHeight, "24px");
  });

  QUnit.test("add and remove event listeners", assert => {
    let cpt = 0;

    function increment() { cpt++; }
    settings.addEventListener("change", increment);

    settings.fontSize = 13;

    assert.strictEqual(cpt, 1, "should increment");

    settings.addEventListener("change", increment);
    settings.fontSize = 14;
    assert.strictEqual(cpt, 2, "duplicate listeners should not be added");

    settings.fontSize = 14;
    assert.strictEqual(cpt, 2, "same value should not trigger event");

    settings.removeEventListener("change", increment);
    settings.fontSize = 16;
    assert.strictEqual(cpt, 2, "listeners can be removed");
  });

  QUnit.test("reset prop", assert => {
    settings.fontSize = 13;
    settings.lineHeight = 1.8;
    settings.dyslexicFont = true;
    settings.contrast = 100;
    settings.invertColors = true;

    settings.reset("fontSize");
    assert.strictEqual(settings.fontSize, settings.initialValues.fontSize);
    assert.strictEqual(settings.lineHeight, 1.8, "specific reset should not interfer with other properties");

    for (const prop in settings.initialValues) {
      settings.reset(prop);
      assert.strictEqual(settings[prop], settings.initialValues[prop]);
    }
  });

  QUnit.test("reset all", assert => {
    settings.fontSize = 13;
    settings.lineHeight = 1.8;
    settings.dyslexicFont = true;
    settings.contrast = 100;
    settings.invertColors = true;

    settings.reset();

    for (const prop in settings.initialValues) {
      assert.strictEqual(settings[prop], settings.initialValues[prop]);
    }
  });

  QUnit.test("throw errors when wrong values", assert => {

    assert.throws(() => settings.fontSize = "13");
    assert.throws(() => settings.fontSize = "toto");
    assert.throws(() => settings.fontSize = true);
    assert.throws(() => settings.fontSize = null);
    assert.throws(() => settings.fontSize = undefined);
    assert.throws(() => settings.fontSize = {});

    assert.throws(() => settings.lineHeight = "1.3");
    assert.throws(() => settings.lineHeight = "toto");
    assert.throws(() => settings.lineHeight = true);
    assert.throws(() => settings.lineHeight = null);
    assert.throws(() => settings.lineHeight = undefined);
    assert.throws(() => settings.lineHeight = {});

    assert.throws(() => settings.contrast = "120");
    assert.throws(() => settings.contrast = "toto");
    assert.throws(() => settings.contrast = true);
    assert.throws(() => settings.contrast = null);
    assert.throws(() => settings.contrast = undefined);
    assert.throws(() => settings.contrast = {});

    assert.throws(() => settings.dyslexicFont = "true");
    assert.throws(() => settings.dyslexicFont = 1);
    assert.throws(() => settings.dyslexicFont = "toto");
    assert.throws(() => settings.dyslexicFont = null);
    assert.throws(() => settings.dyslexicFont = undefined);
    assert.throws(() => settings.dyslexicFont = {});

    assert.throws(() => settings.invertColors = "true");
    assert.throws(() => settings.invertColors = 1);
    assert.throws(() => settings.invertColors = "toto");
    assert.throws(() => settings.invertColors = null);
    assert.throws(() => settings.invertColors = undefined);
    assert.throws(() => settings.invertColors = {});

  });

  QUnit.test("throw errors when out of bounds", assert => {

    assert.throws(() => settings.fontSize = settings.bounds.fontSize[0] - 1);
    assert.throws(() => settings.fontSize = settings.bounds.fontSize[1] + 1);
    assert.throws(() => settings.contrast = settings.bounds.contrast[0] - 1);
    assert.throws(() => settings.contrast = settings.bounds.contrast[1] + 1);
    assert.throws(() => settings.lineHeight = settings.bounds.lineHeight[0] - 0.1);
    assert.throws(() => settings.lineHeight = settings.bounds.lineHeight[1] + 0.1);

  });

  QUnit.test("toggle class important", assert => {
    assert.strictEqual(settings.important, false);
    assert.strictEqual(root.classList.contains("important"), false);
    settings.important = true;
    assert.strictEqual(root.classList.contains("important"), true);
    settings.important = false;
    assert.strictEqual(root.classList.contains("important"), false);

    assert.throws(() => settings.important = "yes");
  });

  QUnit.test("All enumerable values should be in initialValues", assert => {
    for (const key in settings) {
      assert.strictEqual(key in settings.initialValues, true, key);
    }
  });

  QUnit.test("add custom property", assert => {
    const rootCStyle = getComputedStyle(root);

    Object.defineProperty(settings, "color", {
      enumerable : true,
      get() { return rootCStyle.color; },
      set(value) {
        root.style.color = value;
        this.triggerChange("color", value);
      }
    });

    const initialColor = rootCStyle.color;
    const newColor = "rgb(0, 0, 255)";

    let cpt = 0;

    settings.addEventListener("change", () => cpt++);

    settings.initialValues.color = rootCStyle.color;

    assert.strictEqual(settings.color, rootCStyle.color);

    settings.color = newColor;
    assert.strictEqual(rootCStyle.color, newColor);
    assert.strictEqual(cpt, 1);

    settings.save();

    settings.reset("color");
    assert.strictEqual(settings.color, initialColor);

    settings.load();
    assert.strictEqual(settings.color, newColor);
    assert.strictEqual(rootCStyle.color, newColor);
  });

});