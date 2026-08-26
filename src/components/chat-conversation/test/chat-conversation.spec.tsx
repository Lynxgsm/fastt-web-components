import { newSpecPage } from '@stencil/core/testing';
import { ChatConversation } from '../chat-conversation';

const QUESTION = {
  id: 30,
  slug: 'q-complementaire',
  label: 'Je voudrais en savoir plus sur ma complémentaire santé.',
  description: null,
  intro_message: null,
  answer: 'Les intérimaires bénéficient d’un régime obligatoire.',
  kind: 'question' as const,
  children: [],
};

/** Un thème sans question : le cas qui piégeait l'utilisateur avant `kind`. */
const EMPTY_TOPIC = {
  id: 7,
  slug: 'sante-prevoyance',
  label: 'Prévoyance et arrêt de travail',
  description: null,
  intro_message: null,
  answer: null,
  kind: 'topic' as const,
  children: [],
};

/** Thème sans question mais avec message d'accueil : l'accueil sert d'invitation. */
const TOPIC_WITH_INTRO = {
  id: 8,
  slug: 'sante-teleconsultation',
  label: 'Téléconsultation médicale',
  description: null,
  intro_message: 'Comment est-ce que je peux vous aider pour ce sujet ?',
  answer: null,
  kind: 'topic' as const,
  children: [],
};

const SUBJECT = {
  id: 5,
  slug: 'sante',
  label: 'Santé et prévoyance',
  description: 'Mutuelle, prévoyance',
  intro_message: null,
  answer: null,
  kind: 'topic' as const,
  children: [QUESTION, EMPTY_TOPIC, TOPIC_WITH_INTRO],
};

/** Réponses successives données à fetch, dans l'ordre des appels. */
function mockFetch(...responses: Array<{ status?: number; body?: unknown }>) {
  const queue = [...responses];
  (global as any).fetch = jest.fn().mockImplementation(() => {
    const next = queue.shift() ?? { body: {} };
    const status = next.status ?? 200;
    return Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: async () => next.body,
    });
  });
}

async function openTree() {
  mockFetch({ body: { nodes: [SUBJECT] } });
  const page = await newSpecPage({
    components: [ChatConversation],
    html: `<chat-conversation api-endpoint="http://api.test"></chat-conversation>`,
  });
  await page.waitForChanges();
  return page;
}

const options = (page: any) =>
  Array.from(page.root.shadowRoot.querySelectorAll('.option')) as HTMLButtonElement[];
const turns = (page: any) =>
  Array.from(page.root.shadowRoot.querySelectorAll('.turn')) as HTMLElement[];
/** La saisie n'est rendue que lorsqu'elle sert : son absence est le signal. */
const composer = (page: any) =>
  page.root.shadowRoot.querySelector('form.composer') as HTMLFormElement | null;
const canType = (page: any) => {
  const el = page.root.shadowRoot.querySelector('input[name="message"]') as HTMLInputElement | null;
  return el !== null && !el.disabled;
};

describe('chat-conversation', () => {
  it('accueille et propose les sujets de premier niveau', async () => {
    const page = await openTree();

    expect(turns(page)).toHaveLength(1);
    expect(turns(page)[0].textContent).toContain('assistant FASTT');
    expect(options(page).map(o => o.textContent)).toEqual([
      expect.stringContaining('Santé et prévoyance'),
    ]);
  });

  it('n’affiche aucune saisie pendant le parcours guidé', async () => {
    const page = await openTree();
    expect(composer(page)).toBeNull();

    options(page)[0].click();
    await page.waitForChanges();
    // Descendu d'un niveau : toujours aucune saisie.
    expect(composer(page)).toBeNull();
  });

  it('renvoie le choix en bulle utilisateur et descend d’un niveau', async () => {
    const page = await openTree();

    options(page)[0].click();
    await page.waitForChanges();

    const rendered = turns(page);
    expect(rendered).toHaveLength(2);
    expect(rendered[1].textContent).toContain('Santé et prévoyance');
    expect(rendered[1].className).toContain('turn-user');
    // Les options affichées sont maintenant les questions du sujet.
    expect(options(page)[0].textContent).toContain('complémentaire santé');
  });

  it('sert la réponse pré-enregistrée puis demande si elle a aidé', async () => {
    const page = await openTree();
    options(page)[0].click();
    await page.waitForChanges();

    mockFetch({ body: { answer: QUESTION.answer, path: [], message_id: 1209 } });
    options(page)[0].click();
    await page.waitForChanges();
    await page.waitForChanges();

    expect(page.root.shadowRoot.querySelector('.rating')).toBeTruthy();
    expect(page.root.shadowRoot.querySelector('.rating-question').textContent).toContain(
      'Cela vous a-t-il aidé ?',
    );
    // La réponse est celle du serveur, sans appel au modèle.
    const last = turns(page)[turns(page).length - 1];
    expect(last.textContent).toContain('régime obligatoire');
    // Le vote ne propose pas d'écrire.
    expect(composer(page)).toBeNull();
  });

  it('n’affiche la saisie qu’après un « Non »', async () => {
    const page = await openTree();
    options(page)[0].click();
    await page.waitForChanges();

    mockFetch({ body: { answer: QUESTION.answer, path: [], message_id: 1209 } });
    options(page)[0].click();
    await page.waitForChanges();
    await page.waitForChanges();

    expect(composer(page)).toBeNull();

    mockFetch({ body: {} }); // le vote
    const [, non] = Array.from(
      page.root.shadowRoot.querySelectorAll('.pill'),
    ) as HTMLButtonElement[];
    non.click();
    await page.waitForChanges();

    expect(canType(page)).toBe(true);
  });

  it('après un « Oui », remercie et repropose les sujets', async () => {
    const page = await openTree();
    options(page)[0].click();
    await page.waitForChanges();

    mockFetch({ body: { answer: QUESTION.answer, path: [], message_id: 1209 } });
    options(page)[0].click();
    await page.waitForChanges();
    await page.waitForChanges();

    mockFetch({ body: {} });
    const [oui] = Array.from(
      page.root.shadowRoot.querySelectorAll('.pill'),
    ) as HTMLButtonElement[];
    oui.click();
    await page.waitForChanges();

    expect(composer(page)).toBeNull();
    // Retour au premier niveau.
    expect(options(page)[0].textContent).toContain('Santé et prévoyance');
  });

  // Défensif : l'API élague les questions sans réponse, donc ce 404 ne devrait
  // pas survenir. S'il survient, la saisie s'ouvre sans exposer l'état du contenu.
  it('bascule sur la saisie si la réponse est introuvable', async () => {
    const page = await openTree();
    options(page)[0].click();
    await page.waitForChanges();

    mockFetch({ status: 404 });
    options(page)[0].click();
    await page.waitForChanges();
    await page.waitForChanges();

    expect(canType(page)).toBe(true);
    const last = turns(page)[turns(page).length - 1];
    expect(last.textContent).toContain('Reformulez votre question');
    expect(last.textContent).not.toContain('enregistrée');
  });

  // Avant `kind`, la nature d'un nœud était devinée par `children.length`, donc
  // un thème sans question était traité comme une question : appel serveur, 404,
  // et l'utilisateur atterrissait en saisie libre sans explication.
  it('ouvre la saisie sur un thème sans question, sans appeler le serveur', async () => {
    const page = await openTree();
    options(page)[0].click();
    await page.waitForChanges();

    const callsBefore = ((global as any).fetch as jest.Mock).mock.calls.length;

    // Le second choix est EMPTY_TOPIC : un thème, pas une question.
    options(page)[1].click();
    await page.waitForChanges();

    expect(((global as any).fetch as jest.Mock).mock.calls.length).toBe(callsBefore);
    expect(canType(page)).toBe(true);
    const last = turns(page)[turns(page).length - 1];
    // Formulation neutre : l'utilisateur n'a pas à savoir que le contenu manque.
    expect(last.textContent).toContain('Posez votre question sur');
    expect(last.textContent).toContain('Prévoyance et arrêt de travail');
    expect(last.textContent).not.toContain('Aucune question');
  });

  it('affiche le message d’accueil du thème et en fait l’invitation', async () => {
    const page = await openTree();
    options(page)[0].click();
    await page.waitForChanges();

    const callsBefore = ((global as any).fetch as jest.Mock).mock.calls.length;
    options(page)[2].click(); // TOPIC_WITH_INTRO
    await page.waitForChanges();

    // Aucun appel serveur : un thème n'est pas une question.
    expect(((global as any).fetch as jest.Mock).mock.calls.length).toBe(callsBefore);
    const last = turns(page)[turns(page).length - 1];
    expect(last.textContent).toContain('Comment est-ce que je peux vous aider');
    // L'accueil tient lieu d'invitation : pas de second message générique.
    expect(last.textContent).not.toContain('Posez votre question sur');
    expect(canType(page)).toBe(true);
  });

  it('ouvre la saisie quand aucun arbre n’est configuré', async () => {
    mockFetch({ body: { nodes: [] } });
    const page = await newSpecPage({
      components: [ChatConversation],
      html: `<chat-conversation api-endpoint="http://api.test"></chat-conversation>`,
    });
    await page.waitForChanges();

    expect(canType(page)).toBe(true);
  });
});
