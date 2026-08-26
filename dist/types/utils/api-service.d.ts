export type ScopeEvent = {
    scope: 'leaf' | 'global' | 'fallback_global';
    node_id: number | null;
    path: string[];
    notice_key: string | null;
};
export type DecisionNode = {
    id: number;
    slug: string;
    label: string;
    description: string | null;
    intro_message: string | null;
    /** Réponse pré-enregistrée. Renseignée sur les questions (niveau 3). */
    answer: string | null;
    is_leaf: boolean;
    children: DecisionNode[];
};
export type PresetAnswer = {
    answer: string;
    path: string[];
    /** Identifiant serveur du message, requis par le vote Oui / Non. */
    message_id: number | null;
};
export declare function callAIStream(message: string, apiEndpoint: string, conversationId: string, onChunk: (chunk: string) => void, onComplete?: (messageId?: string) => void, onError?: (error: Error) => void, contextNodeId?: number | null, onScope?: (scope: ScopeEvent) => void): Promise<void>;
export declare function fetchDecisionTree(apiEndpoint: string): Promise<DecisionNode[]>;
export declare function handleFeedback(isSatisfied: number, apiEndpoint: string, conversationId: string, onComplete?: () => void, onError?: (error: Error) => void): Promise<void>;
export declare function handleMessageFeedback(isSatisfied: number, apiEndpoint: string, messageId: string, onComplete?: () => void, onError?: (error: Error) => void): Promise<void>;
/**
 * Réponse pré-enregistrée d'une question de l'arbre.
 *
 * Renvoie null sur 404 : la question n'a pas encore de réponse rédigée, et
 * l'appelant doit basculer sur la saisie libre plutôt que rester bloqué.
 */
export declare function fetchPresetAnswer(apiEndpoint: string, nodeId: number, conversationId: string): Promise<PresetAnswer | null>;
