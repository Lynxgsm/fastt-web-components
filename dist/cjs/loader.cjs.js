'use strict';

var index = require('./index-Ca_d1eY4.js');

const defineCustomElements = async (win, options) => {
  if (typeof window === 'undefined') return undefined;
  await index.globalScripts();
  return index.bootstrapLazy([["chat-modal_4.cjs",[[257,"chat-modal",{"modalTitle":[1,"modal-title"],"titleStyle":[16,"title-style"],"iconSize":[2,"icon-size"],"apiEndpoint":[1,"api-endpoint"],"open":[32],"messages":[32],"isLoading":[32],"conversationId":[32]}],[257,"chat-widget",{"apiEndpoint":[1,"api-endpoint"],"messages":[32],"isLoading":[32],"isChatContainerVisible":[32],"conversationId":[32]}],[257,"chat-skeleton"],[257,"satisfaction-buttons",{"apiEndpoint":[1,"api-endpoint"],"conversationId":[1,"conversation-id"]}]]]], options);
};

exports.setNonce = index.setNonce;
exports.defineCustomElements = defineCustomElements;
//# sourceMappingURL=loader.cjs.js.map

//# sourceMappingURL=loader.cjs.js.map