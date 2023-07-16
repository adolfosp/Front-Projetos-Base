export class ThumbGrid {
    DOM = {
        el : null,
        items: null
    }
    constructor(DOM_el) {
        this.DOM.el = DOM_el;
        this.DOM.items = this.DOM.el.querySelectorAll('.thumbgrid__item');

        //manda o efeito de aparição suave
        //willChange é como se fosse para frente e para trás com as propriedades transform e opacity em questão de valor (opacity: 1, opacity: 0)
        gsap.set(this.DOM.items, {willChange: 'transform, opacity'});
    }
}