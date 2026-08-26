'use strict';

var index = require('./index-CY_WzSPA.js');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
/*
 Stencil Client Patch Browser v4.36.1 | MIT Licensed | https://stenciljs.com
 */

var patchBrowser = () => {
  const importMeta = (typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('fastt-web-components.cjs.js', document.baseURI).href));
  const opts = {};
  if (importMeta !== "") {
    opts.resourcesUrl = new URL(".", importMeta).href;
  }
  return index.promiseResolve(opts);
};

patchBrowser().then(async (options) => {
  await index.globalScripts();
  return index.bootstrapLazy([["satisfaction-buttons.cjs",[[257,"satisfaction-buttons",{"apiEndpoint":[1,"api-endpoint"],"messageId":[1,"message-id"],"selectedButton":[32]}]]],["chat-conversation_4.cjs",[[257,"chat-modal",{"modalTitle":[1,"modal-title"],"apiEndpoint":[1,"api-endpoint"]}],[257,"chat-widget",{"apiEndpoint":[1,"api-endpoint"],"isChatContainerVisible":[32]}],[257,"chat-conversation",{"apiEndpoint":[1,"api-endpoint"],"turns":[32],"nodes":[32],"path":[32],"step":[32],"treeError":[32]}],[257,"chat-skeleton"]]]], options);
});

exports.setNonce = index.setNonce;
//# sourceMappingURL=fastt-web-components.cjs.js.map

//# sourceMappingURL=fastt-web-components.cjs.js.map