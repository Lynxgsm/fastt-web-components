const FONTS_HREF = 'https://fonts.googleapis.com/css2?family=Signika:wght@300..700&family=Yantramanav:wght@100;300;400;500;700;900&display=swap';
/**
 * Injecte les polices dans `document.head`.
 *
 * Un `@import` depuis la feuille de style d'un shadow root n'atteindrait pas le
 * document hôte. Le garde évite un second `<link>` quand les deux composants
 * sont montés sur la même page.
 */
export function loadFonts() {
    if (document.querySelector('link[href*="fonts.googleapis.com/css2?family=Signika"]'))
        return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONTS_HREF;
    document.head.appendChild(link);
}
//# sourceMappingURL=fonts.js.map
