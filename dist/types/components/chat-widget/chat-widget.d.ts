export declare class ChatWidget {
    messages: {
        role: string;
        content: string;
        isComplete?: boolean;
    }[];
    isLoading: boolean;
    isChatContainerVisible: boolean;
    apiEndpoint: string;
    private inputEl?;
    componentWillLoad(): void;
    private loadFonts;
    private handleSubmit;
    private toggleChatContainer;
    private setInputRef;
    render(): any[];
}
