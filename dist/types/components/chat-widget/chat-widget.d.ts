type ChatMessage = {
    role: string;
    content: string;
    isComplete?: boolean;
    messageId?: string;
    /** Renseigné quand le serveur a élargi la recherche hors du thème choisi. */
    outOfScopePath?: string[];
};
export declare class ChatWidget {
    messages: ChatMessage[];
    isLoading: boolean;
    isChatContainerVisible: boolean;
    apiEndpoint: string;
    conversationId: string;
    /** 'navigating' : arbre affiché, saisie bloquée. 'chatting' : saisie ouverte. */
    mode: 'navigating' | 'chatting';
    contextNodeId: number | null;
    contextPath: string[];
    private inputEl?;
    componentWillLoad(): void;
    private loadFonts;
    private handleLeafSelected;
    /** Échappatoire : interroger tout le corpus FASTT sans passer par l'arbre. */
    private handleSkip;
    private changeTheme;
    private handleSubmit;
    private toggleChatContainer;
    private setInputRef;
    private renderMarkdown;
    render(): any[];
}
export {};
