'use strict';

var index = require('./index-C7XhOpRA.js');

const defineCustomElements = async (win, options) => {
  if (typeof window === 'undefined') return undefined;
  await index.globalScripts();
  return index.bootstrapLazy([["chat-modal_5.cjs",[[257,"chat-modal",{"modalTitle":[1,"modal-title"],"titleStyle":[16,"title-style"],"iconSize":[2,"icon-size"],"apiEndpoint":[1,"api-endpoint"],"messages":[32],"isLoading":[32],"conversationId":[32],"mode":[32],"contextNodeId":[32],"contextPath":[32]}],[257,"chat-widget",{"apiEndpoint":[1,"api-endpoint"],"messages":[32],"isLoading":[32],"isChatContainerVisible":[32],"conversationId":[32],"mode":[32],"contextNodeId":[32],"contextPath":[32]}],[257,"chat-skeleton"],[257,"decision-tree-nav",{"apiEndpoint":[1,"api-endpoint"],"allowSkip":[4,"allow-skip"],"nodes":[32],"path":[32],"isLoading":[32],"error":[32]}],[257,"satisfaction-buttons",{"apiEndpoint":[1,"api-endpoint"],"messageId":[1,"message-id"],"selectedButton":[32]}]]]], options);
};

exports.setNonce = index.setNonce;
exports.defineCustomElements = defineCustomElements;
//# sourceMappingURL=loader.cjs.js.map

//# sourceMappingURL=loader.cjs.js.map