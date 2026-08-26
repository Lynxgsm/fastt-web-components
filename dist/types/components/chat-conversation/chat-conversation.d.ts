import { DecisionNode } from '../../utils/api-service';
/**
 * Un tour de conversation. `id` est local et sert de clé de rendu ; `messageId`
 * est l'identifiant serveur, seul utilisable pour voter.
 */
type Turn = {
    id: number;
    role: 'user' | 'bot';
    content: string;
    messageId?: number | null;
    /** Renseigné quand le serveur a élargi la recherche hors du thème choisi. */
    outOfScopePath?: string[];
    streaming?: boolean;
};
/**
 * `choosing` : boutons d'options, saisie bloquée.
 * `rating`   : « Cela vous a-t-il aidé ? », saisie bloquée.
 * `typing`   : saisie ouverte — uniquement après un « Non ».
 * `streaming`: réponse du modèle en cours.
 */
type Step = 'choosing' | 'rating' | 'typing' | 'streaming';
export declare class ChatConversation {
    apiEndpoint: string;
    turns: Turn[];
    nodes: DecisionNode[];
    path: DecisionNode[];
    step: Step;
    treeError: string;
    private conversationId;
    private nextId;
    /** Question courante : périmètre documentaire de la saisie libre. */
    private questionNodeId;
    /** Message serveur soumis au vote en cours. */
    private ratingMessageId;
    private scroller?;
    private inputEl?;
    private pinnedToBottom;
    componentWillLoad(): Promise<void>;
    componentDidRender(): void;
    private onScroll;
    private say;
    /** Mise à jour par identifiant, jamais par position : un tour peut s'ajouter
     *  pendant qu'une réponse est en train d'arriver. */
    private patch;
    private get options();
    private pick;
    private serveAnswer;
    private rate;
    private back;
    private restart;
    private submit;
    private renderMarkdown;
    private renderAffordance;
    render(): any;
}
export {};
