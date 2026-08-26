/**
 * Bulle flottante et son panneau.
 *
 * Ne porte que son chrome : le parcours vit dans `chat-conversation`, partagé
 * avec `chat-modal`.
 */
export declare class ChatWidget {
    apiEndpoint: string;
    isChatContainerVisible: boolean;
    componentWillLoad(): void;
    private toggle;
    render(): any[];
}
