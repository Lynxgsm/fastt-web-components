/**
 * Conservation de l'identifiant de conversation d'un chargement de page au suivant.
 *
 * Seul l'identifiant est stocké, pas le transcript : les messages sont déjà en base,
 * et `GET /conversation/{id}/messages` les relit. Une seule source de vérité, et
 * l'état des pouces revient avec.
 *
 * `localStorage` et non `sessionStorage` : la conversation doit survivre à la
 * fermeture de l'onglet et du navigateur, pas seulement au rafraîchissement. En
 * contrepartie il faut une péremption, sans quoi une conversation vieille de
 * plusieurs mois ressusciterait hors contexte.
 */
/** Péremption comptée depuis la dernière activité, pas depuis la création. */
export declare const SESSION_TTL_MS: number;
/** L'identifiant conservé, ou `null` s'il n'y en a pas ou s'il est périmé. */
export declare function loadConversationId(): string | null;
/**
 * Retient la session, et repousse sa péremption. À appeler **à l'envoi d'un
 * message**, et seulement là.
 *
 * Rien n'est enregistré au montage du composant : l'API ne crée la ligne
 * `conversations` qu'avec le premier message, donc un identifiant tout juste
 * généré n'existe pas encore côté serveur et le relire répondrait 404. Attendre
 * le premier envoi, c'est garantir qu'un identifiant stocké est toujours
 * relisable.
 *
 * Renvoie l'identifiant réellement retenu : si une session est déjà ouverte pour
 * cette page, on la **rejoint** plutôt que de l'écraser. C'est ce qui rend le
 * partage cohérent quand deux composants de chat cohabitent — sans quoi le
 * second effacerait la conversation vivante du premier.
 */
export declare function rememberSession(id: string): string;
export declare function clearSession(): void;
