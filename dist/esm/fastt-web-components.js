import { p as promiseResolve, g as globalScripts, b as bootstrapLazy } from './index-CXxQ9Zqa.js';
export { s as setNonce } from './index-CXxQ9Zqa.js';

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
  return bootstrapLazy([["chat-modal_4",[[257,"chat-modal",{"modalTitle":[1,"modal-title"],"titleStyle":[16,"title-style"],"iconSize":[2,"icon-size"],"apiEndpoint":[1,"api-endpoint"],"open":[32],"messages":[32],"isLoading":[32],"conversationId":[32]}],[257,"chat-widget",{"apiEndpoint":[1,"api-endpoint"],"messages":[32],"isLoading":[32],"isChatContainerVisible":[32],"conversationId":[32]}],[257,"chat-skeleton"],[257,"satisfaction-buttons"]]]], options);
});
//# sourceMappingURL=fastt-web-components.js.map

//# sourceMappingURL=fastt-web-components.js.map