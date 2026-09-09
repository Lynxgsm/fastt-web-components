import { clearSession, loadConversationId, rememberSession, SESSION_TTL_MS } from './session-store';

const STORAGE_KEY = 'fastt.chat.session';

describe('session-store', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.restoreAllMocks();
  });

  it('ne retrouve rien quand aucune session n’a été enregistrée', () => {
    expect(loadConversationId()).toBeNull();
  });

  it('rend l’identifiant enregistré — le cas du rafraîchissement de page', () => {
    rememberSession('conv_1_abc');
    expect(loadConversationId()).toBe('conv_1_abc');
  });

  it('crée la session au premier message, et rend l’identifiant retenu', () => {
    expect(rememberSession('conv_neuf')).toBe('conv_neuf');
    expect(loadConversationId()).toBe('conv_neuf');
  });

  it('rejoint une session déjà ouverte plutôt que de l’écraser', () => {
    // Deux composants de chat sur la même page : le second doit rejoindre la
    // conversation du premier, pas la remplacer par la sienne.
    rememberSession('conv_premier');

    expect(rememberSession('conv_second')).toBe('conv_premier');
    expect(loadConversationId()).toBe('conv_premier');
  });

  it('oublie une session inactive depuis plus que la péremption', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: 'conv_vieux', updatedAt: Date.now() - SESSION_TTL_MS - 1000 }));

    expect(loadConversationId()).toBeNull();
    // Elle est aussi purgée, pour ne pas être réexaminée à chaque chargement.
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('garde une session juste en deçà de la péremption', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: 'conv_limite', updatedAt: Date.now() - SESSION_TTL_MS + 5000 }));

    expect(loadConversationId()).toBe('conv_limite');
  });

  it('repousse la péremption à chaque message envoyé', () => {
    const presqueVieux = Date.now() - SESSION_TTL_MS + 1000;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: 'conv_actif', updatedAt: presqueVieux }));

    rememberSession('conv_ignore');

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    expect(stored.id).toBe('conv_actif');
    expect(stored.updatedAt).toBeGreaterThan(presqueVieux);
  });

  it('n’hérite pas d’une session périmée : le nouvel identifiant prend la place', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: 'conv_perime', updatedAt: Date.now() - SESSION_TTL_MS - 1000 }));

    expect(rememberSession('conv_neuf')).toBe('conv_neuf');
    expect(loadConversationId()).toBe('conv_neuf');
  });

  it('oublie la session sur clearSession', () => {
    rememberSession('conv_a_jeter');
    clearSession();
    expect(loadConversationId()).toBeNull();
  });

  it('ignore un contenu stocké illisible ou incomplet', () => {
    window.localStorage.setItem(STORAGE_KEY, 'pas du json');
    expect(loadConversationId()).toBeNull();

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: 'conv_sans_date' }));
    expect(loadConversationId()).toBeNull();

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ updatedAt: Date.now() }));
    expect(loadConversationId()).toBeNull();
  });

  it('ne lève pas quand le stockage est refusé', () => {
    // Navigation privée stricte, stockage désactivé, iframe cloisonnée : le simple
    // accès lève. Le chat doit continuer sans persistance, pas planter.
    jest.spyOn(window.localStorage, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    jest.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    jest.spyOn(window.localStorage, 'removeItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });

    expect(() => rememberSession('conv_x')).not.toThrow();
    expect(() => clearSession()).not.toThrow();
    expect(loadConversationId()).toBeNull();
    // Le stockage est refusé, donc rien n'est retenu : l'appelant garde son propre
    // identifiant et la conversation se déroule sans persistance.
    expect(rememberSession('conv_x')).toBe('conv_x');
  });
});
