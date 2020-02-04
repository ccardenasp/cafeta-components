import { a as patchEsm, b as bootstrapLazy } from './core-d1147b68.js';

const defineCustomElements = (win, options) => {
  return patchEsm().then(() => {
    bootstrapLazy([["cc-button",[[1,"cc-button",{"iconName":[1,"icon-name"],"iconReverse":[4,"icon-reverse"],"iconOnly":[4,"icon-only"],"disabled":[4],"fill":[1],"expand":[4],"color":[1],"href":[1],"target":[1],"size":[1]}]]],["cc-badge",[[1,"cc-badge",{"color":[1]}]]],["cc-text",[[1,"cc-text",{"type":[1],"strong":[4],"tag":[1]}]]],["cc-icon",[[1,"cc-icon",{"name":[1],"size":[2]}]]]], options);
  });
};

export { defineCustomElements };
