import { p as promiseResolve, g as globalScripts, b as bootstrapLazy } from './index-Bw6qG5-Z.js';
export { s as setNonce } from './index-Bw6qG5-Z.js';

/*
 Stencil Client Patch Browser v4.36.1 | MIT Licensed | https://stenciljs.com
 */

var patchBrowser = () => {
  const importMeta = import.meta.url;
  const opts = {};
  if (importMeta !== "") {
    opts.resourcesUrl = new URL(".", importMeta).href;
  }
  return promiseResolve(opts);
};

patchBrowser().then(async (options) => {
  await globalScripts();
  return bootstrapLazy([["chat-modal_5",[[257,"chat-modal",{"modalTitle":[1,"modal-title"],"titleStyle":[16,"title-style"],"iconSize":[2,"icon-size"],"apiEndpoint":[1,"api-endpoint"],"messages":[32],"isLoading":[32],"conversationId":[32],"mode":[32],"contextNodeId":[32],"contextPath":[32]}],[257,"chat-widget",{"apiEndpoint":[1,"api-endpoint"],"messages":[32],"isLoading":[32],"isChatContainerVisible":[32],"conversationId":[32],"mode":[32],"contextNodeId":[32],"contextPath":[32]}],[257,"chat-skeleton"],[257,"decision-tree-nav",{"apiEndpoint":[1,"api-endpoint"],"allowSkip":[4,"allow-skip"],"nodes":[32],"path":[32],"isLoading":[32],"error":[32]}],[257,"satisfaction-buttons",{"apiEndpoint":[1,"api-endpoint"],"messageId":[1,"message-id"],"selectedButton":[32]}]]]], options);
});
//# sourceMappingURL=fastt-web-components.js.map

//# sourceMappingURL=fastt-web-components.js.map