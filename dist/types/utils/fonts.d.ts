/**
 * Injecte les polices dans `document.head`.
 *
 * Un `@import` depuis la feuille de style d'un shadow root n'atteindrait pas le
 * document hôte. Le garde évite un second `<link>` quand les deux composants
 * sont montés sur la même page.
 */
export declare function loadFonts(): void;
