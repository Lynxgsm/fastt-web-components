'use strict';

var index = require('./index-C7XhOpRA.js');

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
  return index.bootstrapLazy([["chat-modal_5.cjs",[[257,"chat-modal",{"modalTitle":[1,"modal-title"],"titleStyle":[16,"title-style"],"iconSize":[2,"icon-size"],"apiEndpoint":[1,"api-endpoint"],"messages":[32],"isLoading":[32],"conversationId":[32],"mode":[32],"contextNodeId":[32],"contextPath":[32]}],[257,"chat-widget",{"apiEndpoint":[1,"api-endpoint"],"messages":[32],"isLoading":[32],"isChatContainerVisible":[32],"conversationId":[32],"mode":[32],"contextNodeId":[32],"contextPath":[32]}],[257,"chat-skeleton"],[257,"decision-tree-nav",{"apiEndpoint":[1,"api-endpoint"],"allowSkip":[4,"allow-skip"],"nodes":[32],"path":[32],"isLoading":[32],"error":[32]}],[257,"satisfaction-buttons",{"apiEndpoint":[1,"api-endpoint"],"messageId":[1,"message-id"],"selectedButton":[32]}]]]], options);
});

exports.setNonce = index.setNonce;
//# sourceMappingURL=fastt-web-components.cjs.js.map

//# sourceMappingURL=fastt-web-components.cjs.js.map