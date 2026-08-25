import { TitleStyle } from './types';
type ChatMessage = {
    role: string;
    content: string;
    isComplete?: boolean;
    messageId?: string;
    /** Renseigné quand le serveur a élargi la recherche hors du thème choisi. */
    outOfScopePath?: string[];
};
export declare class ChatModal {
    modalTitle: string;
    titleStyle: Partial<TitleStyle>;
    messages: ChatMessage[];
    isLoading: boolean;
    iconSize: number;
    apiEndpoint: string;
    conversationId: string;
    /** 'navigating' : arbre affiché, saisie bloquée. 'chatting' : saisie ouverte. */
    mode: 'navigating' | 'chatting';
    contextNodeId: number | null;
    contextPath: string[];
    componentWillLoad(): void;
    private loadFonts;
    private handleLeafSelected;
    /** Échappatoire : interroger tout le corpus FASTT sans passer par l'arbre. */
    private handleSkip;
    private changeTheme;
    private handleChunk;
    private handleSubmit;
    private renderMarkdown;
    private renderContextBanner;
    render(): any;
}
export {};
