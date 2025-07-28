# chat-modal



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description | Type                                                          | Default                           |
| ------------- | -------------- | ----------- | ------------------------------------------------------------- | --------------------------------- |
| `apiEndpoint` | `api-endpoint` |             | `string`                                                      | `'http://51.159.134.1:8000'`      |
| `iconSize`    | `icon-size`    |             | `number`                                                      | `16`                              |
| `title`       | `title`        |             | `string`                                                      | `"Que puis-je faire pour vous ?"` |
| `titleStyle`  | `title-style`  |             | `{ fontSize?: string; fontWeight?: string; color?: string; }` | `{}`                              |


## Dependencies

### Depends on

- [chat-skeleton](../chat-skeleton)
- [satisfaction-buttons](../satisfaction-buttons)

### Graph
```mermaid
graph TD;
  chat-modal --> chat-skeleton
  chat-modal --> satisfaction-buttons
  style chat-modal fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
