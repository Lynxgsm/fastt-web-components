export declare class SatisfactionButtons {
    apiEndpoint: string;
    messageId: string;
    selectedButton: 'up' | 'down' | null;
    private unsubscribe;
    componentDidLoad(): void;
    disconnectedCallback(): void;
    private handleThumbsUp;
    private handleThumbsDown;
    render(): any;
}
