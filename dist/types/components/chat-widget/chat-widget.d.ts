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
    isRestoring: boolean;
    private inputEl?;
    componentWillLoad(): void;
    componentDidLoad(): Promise<void>;
    private loadFonts;
    private handleSubmit;
    private toggleChatContainer;
    private handleNewConversation;
    private setInputRef;
    private renderMarkdown;
    render(): any[];
}
