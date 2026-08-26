import { p as promiseResolve, g as globalScripts, b as bootstrapLazy } from './index-C1-X4K-8.js';
export { s as setNonce } from './index-C1-X4K-8.js';

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
  return bootstrapLazy([["satisfaction-buttons",[[257,"satisfaction-buttons",{"apiEndpoint":[1,"api-endpoint"],"messageId":[1,"message-id"],"selectedButton":[32]}]]],["chat-conversation_4",[[257,"chat-modal",{"modalTitle":[1,"modal-title"],"apiEndpoint":[1,"api-endpoint"]}],[257,"chat-widget",{"apiEndpoint":[1,"api-endpoint"],"isChatContainerVisible":[32]}],[257,"chat-conversation",{"apiEndpoint":[1,"api-endpoint"],"turns":[32],"nodes":[32],"path":[32],"step":[32],"treeError":[32]}],[257,"chat-skeleton"]]]], options);
});
//# sourceMappingURL=fastt-web-components.js.map

//# sourceMappingURL=fastt-web-components.js.map