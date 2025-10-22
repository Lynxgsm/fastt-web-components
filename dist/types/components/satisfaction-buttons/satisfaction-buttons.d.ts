export declare class SatisfactionButtons {
    apiEndpoint: string;
    conversationId: string;
    selectedButton: 'up' | 'down' | null;
    private unsubscribe;
    componentDidLoad(): void;
    disconnectedCallback(): void;
    private handleThumbsUp;
    private handleThumbsDown;
    render(): any;
}
