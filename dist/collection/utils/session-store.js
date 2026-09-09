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
const STORAGE_KEY = 'fastt.chat.session';
/** Péremption comptée depuis la dernière activité, pas depuis la création. */
export const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
/**
 * Le simple accès à `localStorage` lève dans certains contextes — navigation privée
 * stricte, stockage refusé par l'utilisateur, iframe cloisonnée. Le chat doit alors
 * continuer de fonctionner sans persistance, jamais planter : chaque accès est isolé,
 * et un échec vaut « pas de session stockée ».
 */
function readRaw() {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return null;
        const parsed = JSON.parse(raw);
        if (typeof parsed?.id !== 'string' || !parsed.id || typeof parsed.updatedAt !== 'number') {
            return null;
        }
        return { id: parsed.id, updatedAt: parsed.updatedAt };
    }
    catch {
        return null;
    }
}
function writeRaw(session) {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
    catch {
        // Sans persistance, la conversation ne survivra pas au rechargement — mais la
        // session en cours reste parfaitement utilisable.
    }
}
/** L'identifiant conservé, ou `null` s'il n'y en a pas ou s'il est périmé. */
export function loadConversationId() {
    const session = readRaw();
    if (!session)
        return null;
    // Une horloge remise en arrière donnerait un âge négatif : `Math.abs` évite de
    // garder indéfiniment une session que l'on ne saurait plus dater.
    if (Math.abs(Date.now() - session.updatedAt) > SESSION_TTL_MS) {
        clearSession();
        return null;
    }
    return session.id;
}
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
export function rememberSession(id) {
    const existing = loadConversationId();
    const effective = existing ?? id;
    writeRaw({ id: effective, updatedAt: Date.now() });
    return effective;
}
export function clearSession() {
    try {
        window.localStorage.removeItem(STORAGE_KEY);
    }
    catch {
        // Rien à faire : il n'y avait de toute façon rien de persisté.
    }
}
//# sourceMappingURL=session-store.js.map
