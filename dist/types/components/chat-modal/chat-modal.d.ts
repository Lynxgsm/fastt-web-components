import { TitleStyle } from './types';
export declare class ChatModal {
    modalTitle: string;
    titleStyle: Partial<TitleStyle>;
    messages: {
        role: string;
        content: string;
        isComplete?: boolean;
    }[];
    isLoading: boolean;
    iconSize: number;
    apiEndpoint: string;
    conversationId: string;
    componentWillLoad(): void;
    private loadFonts;
    private handleChunk;
    private handleSubmit;
    private renderMarkdown;
    render(): any;
}
