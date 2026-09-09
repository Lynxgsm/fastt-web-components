/**
 * Reprise d'une conversation d'un chargement de page au suivant.
 *
 * `chat-widget` et `chat-modal` ont la même logique de session : elle vit ici, pour
 * qu'ils ne puissent pas diverger.
 */
/** La forme d'un message telle que l'attendent les deux composants. */
export interface ChatMessage {
    role: string;
    content: string;
    isComplete?: boolean;
    messageId?: string;
}
export type RestoreResult = 
/** Transcript relu — éventuellement vide, si la conversation n'a pas d'échange. */
{
    status: 'restored';
    messages: ChatMessage[];
}
/** La conversation n'existe plus côté API : repartir d'un identifiant neuf. */
 | {
    status: 'gone';
}
/** API injoignable : garder la session, une prochaine visite la restaurera. */
 | {
    status: 'unavailable';
};
/**
 * L'identifiant à utiliser pour cette page. Volontairement synchrone : appelé depuis
 * `componentWillLoad`, il ne doit pas retarder le premier rendu.
 *
 * **Rien n'est enregistré ici.** C'est `rememberSession`, à l'envoi du premier
 * message, qui persiste — voir la raison dans `session-store.ts`. Conséquence
 * utile : `restored` ne peut plus être vrai pour une conversation vide, donc la
 * relecture ne porte que sur des conversations qui existent réellement en base.
 */
export declare function resolveConversationId(): {
    id: string;
    restored: boolean;
};
/**
 * Repart de zéro : nouvelle conversation, et l'ancienne n'est plus rattachable.
 *
 * Le nouvel identifiant n'est pas enregistré non plus — le prochain envoi s'en
 * chargera, exactement comme lors d'une première visite.
 */
export declare function startNewConversation(): string;
/**
 * Relit le transcript d'une conversation reprise.
 *
 * On distingue les deux échecs, parce qu'ils n'appellent pas la même réaction : une
 * conversation absente n'a rien à relire et son entrée stockée ne vaut plus rien, alors
 * qu'une API momentanément injoignable ne justifie pas de jeter la session — ce serait
 * perdre pour de bon un transcript qui existe encore.
 *
 * `gone` ne veut **pas** dire « fabriquer un identifiant neuf » : l'appelant garde le
 * sien. En fabriquer un ici réécrivait le stockage et effaçait la conversation vivante
 * d'un autre composant de la page.
 */
export declare function restoreMessages(apiEndpoint: string, conversationId: string): Promise<RestoreResult>;
