/**
 * Panneau de chat intégré dans la page.
 *
 * Ne porte que son chrome : tout le parcours (arbre guidé, réponses
 * pré-enregistrées, vote, saisie libre) vit dans `chat-conversation`, partagé
 * avec `chat-widget`. Les deux composants étaient auparavant dupliqués à 90 %,
 * et leurs divergences étaient des bogues, pas des fonctionnalités.
 */
export declare class ChatModal {
    modalTitle: string;
    apiEndpoint: string;
    componentWillLoad(): void;
    render(): any;
}
