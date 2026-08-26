'use strict';

var index = require('./index-CY_WzSPA.js');

const defineCustomElements = async (win, options) => {
  if (typeof window === 'undefined') return undefined;
  await index.globalScripts();
  return index.bootstrapLazy([["satisfaction-buttons.cjs",[[257,"satisfaction-buttons",{"apiEndpoint":[1,"api-endpoint"],"messageId":[1,"message-id"],"selectedButton":[32]}]]],["chat-conversation_4.cjs",[[257,"chat-modal",{"modalTitle":[1,"modal-title"],"apiEndpoint":[1,"api-endpoint"]}],[257,"chat-widget",{"apiEndpoint":[1,"api-endpoint"],"isChatContainerVisible":[32]}],[257,"chat-conversation",{"apiEndpoint":[1,"api-endpoint"],"turns":[32],"nodes":[32],"path":[32],"step":[32],"treeError":[32]}],[257,"chat-skeleton"]]]], options);
};

exports.setNonce = index.setNonce;
exports.defineCustomElements = defineCustomElements;
//# sourceMappingURL=loader.cjs.js.map

//# sourceMappingURL=loader.cjs.js.map