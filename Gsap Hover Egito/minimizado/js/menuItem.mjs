
export class MenuItem {
    DOM = {
        el : null,
        title: null,
    }
    thumbGrid;
    contentItem;
    titleChars;

    constructor(DOM_el, thumbGrid, contentItem) {
        this.DOM.el = DOM_el;
        this.thumbGrid = thumbGrid;
        this.contentItem = contentItem;

        this.DOM.title = this.DOM.el.querySelector('.menu__item-title');
        this.DOM.description = this.DOM.el.querySelector('.menu__item-desc');

        this.DOM.title.dataset.splitting = '';
        Splitting();

        gsap.set([this.DOM.title, this.DOM.description], {willChange: 'transform, opacity'});
    }
}