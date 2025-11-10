export declare class ChatWidget {
    messages: {
        role: string;
        content: string;
        isComplete?: boolean;
        messageId?: string;
    }[];
    isLoading: boolean;
    isChatContainerVisible: boolean;
    apiEndpoint: string;
    conversationId: string;
    private inputEl?;
    componentWillLoad(): void;
    private loadFonts;
    private handleSubmit;
    private toggleChatContainer;
    private setInputRef;
    private renderMarkdown;
    render(): any[];
}
