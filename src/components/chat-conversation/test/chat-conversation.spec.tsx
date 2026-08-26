import { newSpecPage } from '@stencil/core/testing';
import { ChatConversation } from '../chat-conversation';

const QUESTION = {
  id: 30,
  slug: 'q-complementaire',
  label: 'Je voudrais en savoir plus sur ma complémentaire santé.',
  description: null,
  intro_message: null,
  answer: 'Les intérimaires bénéficient d’un régime obligatoire.',
  is_leaf: true,
  children: [],
};

const SUBJECT = {
  id: 5,
  slug: 'sante',
  label: 'Santé et prévoyance',
  description: 'Mutuelle, prévoyance',
  intro_message: null,
  answer: null,
  is_leaf: false,
  children: [QUESTION],
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
const input = (page: any) =>
  page.root.shadowRoot.querySelector('input[name="message"]') as HTMLInputElement;

describe('chat-conversation', () => {
  it('accueille et propose les sujets de premier niveau', async () => {
    const page = await openTree();

    expect(turns(page)).toHaveLength(1);
    expect(turns(page)[0].textContent).toContain('assistant FASTT');
    expect(options(page).map(o => o.textContent)).toEqual([
      expect.stringContaining('Santé et prévoyance'),
    ]);
  });

  it('garde la saisie bloquée pendant tout le parcours guidé', async () => {
    const page = await openTree();
    expect(input(page).disabled).toBe(true);

    options(page)[0].click();
    await page.waitForChanges();
    // Descendu d'un niveau : toujours bloqué.
    expect(input(page).disabled).toBe(true);
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
    // Le vote reste fermé à la saisie.
    expect(input(page).disabled).toBe(true);
  });

  it('ouvre la saisie après un « Non », et pas avant', async () => {
    const page = await openTree();
    options(page)[0].click();
    await page.waitForChanges();

    mockFetch({ body: { answer: QUESTION.answer, path: [], message_id: 1209 } });
    options(page)[0].click();
    await page.waitForChanges();
    await page.waitForChanges();

    expect(input(page).disabled).toBe(true);

    mockFetch({ body: {} }); // le vote
    const [, non] = Array.from(
      page.root.shadowRoot.querySelectorAll('.pill'),
    ) as HTMLButtonElement[];
    non.click();
    await page.waitForChanges();

    expect(input(page).disabled).toBe(false);
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

    expect(input(page).disabled).toBe(true);
    // Retour au premier niveau.
    expect(options(page)[0].textContent).toContain('Santé et prévoyance');
  });

  // Pendant la rédaction des réponses par FASTT, une question sans réponse ne
  // doit pas être une impasse.
  it('bascule sur la saisie quand la question n’a pas encore de réponse', async () => {
    const page = await openTree();
    options(page)[0].click();
    await page.waitForChanges();

    mockFetch({ status: 404 });
    options(page)[0].click();
    await page.waitForChanges();
    await page.waitForChanges();

    expect(input(page).disabled).toBe(false);
    const last = turns(page)[turns(page).length - 1];
    expect(last.textContent).toContain("pas encore de réponse");
  });

  it('ouvre la saisie quand aucun arbre n’est configuré', async () => {
    mockFetch({ body: { nodes: [] } });
    const page = await newSpecPage({
      components: [ChatConversation],
      html: `<chat-conversation api-endpoint="http://api.test"></chat-conversation>`,
    });
    await page.waitForChanges();

    expect(input(page).disabled).toBe(false);
  });
});
