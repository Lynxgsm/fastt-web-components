import { TitleStyle } from './types';
export declare class ChatModal {
    modalTitle: string;
    titleStyle: Partial<TitleStyle>;
    messages: {
        role: string;
        content: string;
        isComplete?: boolean;
        messageId?: string;
    }[];
    isLoading: boolean;
    iconSize: number;
    apiEndpoint: string;
    conversationId: string;
    isRestoring: boolean;
    componentWillLoad(): void;
    componentDidLoad(): Promise<void>;
    private handleNewConversation;
    private loadFonts;
    private handleChunk;
    private handleSubmit;
    private renderMarkdown;
    render(): any;
}
