import { EventEmitter } from '../../stencil-public-runtime';
import { DecisionNode } from '../../utils/api-service';
/**
 * Navigation guidée : l'utilisateur descend l'arbre de décision jusqu'à une
 * feuille avant de pouvoir poser sa question. Le niveau 1 fournit le
 * regroupement par thème.
 */
export declare class DecisionTreeNav {
    apiEndpoint: string;
    /** Permet de sauter l'arbre et d'interroger l'ensemble du corpus FASTT. */
    allowSkip: boolean;
    nodes: DecisionNode[];
    path: DecisionNode[];
    isLoading: boolean;
    error: string;
    /** Émis quand une feuille est atteinte : le chat peut s'ouvrir. */
    leafSelected: EventEmitter<{
        node: DecisionNode;
        path: DecisionNode[];
    }>;
    /** Émis quand l'utilisateur choisit de poser directement sa question. */
    skipRequested: EventEmitter<void>;
    componentWillLoad(): Promise<void>;
    private load;
    /** Options affichées au niveau courant. */
    private get options();
    private select;
    private goTo;
    render(): any;
}
