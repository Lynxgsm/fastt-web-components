import { Component, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { DecisionNode, fetchDecisionTree } from '../../utils/api-service';

/**
 * Navigation guidée : l'utilisateur descend l'arbre de décision jusqu'à une
 * feuille avant de pouvoir poser sa question. Le niveau 1 fournit le
 * regroupement par thème.
 */
@Component({
  tag: 'decision-tree-nav',
  styleUrl: 'decision-tree-nav.css',
  shadow: true,
})
export class DecisionTreeNav {
  @Prop() apiEndpoint: string = '';
  /** Permet de sauter l'arbre et d'interroger l'ensemble du corpus FASTT. */
  @Prop() allowSkip: boolean = true;

  @State() nodes: DecisionNode[] = [];
  @State() path: DecisionNode[] = [];
  @State() isLoading: boolean = true;
  @State() error: string = '';

  /** Émis quand une feuille est atteinte : le chat peut s'ouvrir. */
  @Event() leafSelected: EventEmitter<{ node: DecisionNode; path: DecisionNode[] }>;
  /** Émis quand l'utilisateur choisit de poser directement sa question. */
  @Event() skipRequested: EventEmitter<void>;

  async componentWillLoad() {
    await this.load();
  }

  private async load() {
    this.isLoading = true;
    this.error = '';
    try {
      this.nodes = await fetchDecisionTree(this.apiEndpoint);
      if (this.nodes.length === 0) {
        // Aucun arbre configuré : ne pas bloquer l'utilisateur dans une impasse.
        this.skipRequested.emit();
      }
    } catch (e) {
      this.error = "Les thèmes n'ont pas pu être chargés.";
      console.error('decision-tree-nav:', e);
    } finally {
      this.isLoading = false;
    }
  }

  /** Options affichées au niveau courant. */
  private get options(): DecisionNode[] {
    const current = this.path[this.path.length - 1];
    return current ? current.children : this.nodes;
  }

  private select = (node: DecisionNode) => {
    const nextPath = [...this.path, node];
    // Une feuille, ou un nœud sans enfant, termine la navigation.
    if (node.is_leaf || node.children.length === 0) {
      this.leafSelected.emit({ node, path: nextPath });
      return;
    }
    this.path = nextPath;
  };

  private goTo = (index: number) => {
    this.path = this.path.slice(0, index);
  };

  render() {
    if (this.isLoading) {
      return (
        <Host>
          <div class="tree-status">Chargement des thèmes…</div>
        </Host>
      );
    }

    if (this.error) {
      return (
        <Host>
          <div class="tree-status tree-error">
            {this.error}
            <button type="button" class="tree-link" onClick={() => this.load()}>
              Réessayer
            </button>
            {this.allowSkip && (
              <button type="button" class="tree-link" onClick={() => this.skipRequested.emit()}>
                Poser directement ma question
              </button>
            )}
          </div>
        </Host>
      );
    }

    const current = this.path[this.path.length - 1];

    return (
      <Host>
        <div class="tree">
          {this.path.length > 0 && (
            <nav class="tree-breadcrumb" aria-label="Fil d'Ariane">
              <button type="button" class="crumb" onClick={() => this.goTo(0)}>
                Thèmes
              </button>
              {this.path.map((node, index) => (
                <span key={node.id} class="crumb-group">
                  <span class="crumb-sep" aria-hidden="true">
                    ›
                  </span>
                  <button type="button" class="crumb" onClick={() => this.goTo(index + 1)} disabled={index === this.path.length - 1}>
                    {node.label}
                  </button>
                </span>
              ))}
            </nav>
          )}

          <p class="tree-prompt">{current ? current.label : 'Sur quel sujet portez-vous votre demande ?'}</p>

          <div class="tree-options">
            {this.options.map(node => (
              <button key={node.id} type="button" class="tree-option" onClick={() => this.select(node)}>
                <span class="option-label">{node.label}</span>
                {node.description && <span class="option-description">{node.description}</span>}
              </button>
            ))}
          </div>

          <div class="tree-footer">
            {this.path.length > 0 && (
              <button type="button" class="tree-link" onClick={() => this.goTo(this.path.length - 1)}>
                ← Retour
              </button>
            )}
            {this.allowSkip && (
              <button type="button" class="tree-link tree-skip" onClick={() => this.skipRequested.emit()}>
                Poser directement ma question
              </button>
            )}
          </div>
        </div>
      </Host>
    );
  }
}
