# chat-conversation



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description | Type     | Default       |
| ------------- | -------------- | ----------- | -------- | ------------- |
| `apiEndpoint` | `api-endpoint` |             | `string` | `Env.API_URL` |


## Dependencies

### Used by

 - [chat-modal](../chat-modal)
 - [chat-widget](../chat-widget)

### Depends on

- [chat-skeleton](../chat-skeleton)

### Graph
```mermaid
graph TD;
  chat-conversation --> chat-skeleton
  chat-modal --> chat-conversation
  chat-widget --> chat-conversation
  style chat-conversation fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
