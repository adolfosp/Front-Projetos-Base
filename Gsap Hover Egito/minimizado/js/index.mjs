import { ThumbGrid } from './thumbGrid.mjs';
import { MenuItem } from './menuItem.mjs';

// Thumbs grid items
let thumbGrids = [];
[...document.querySelectorAll('.thumbgrid-wrap > .thumbgrid')].forEach(thumbGrid => {
    thumbGrids.push(new ThumbGrid(thumbGrid));
});

// Menu items
const menu = document.querySelector('.menu');
let menuItems = [];
[...menu.querySelectorAll('.menu__item')].forEach((menuItem, _) => {
    menuItems.push(new MenuItem(menuItem, thumbGrids[0], 0));
});


for (const menuItem of menuItems) {
    menuItem.DOM.el.addEventListener('mouseenter', () => {

        menuItem.enterTL = gsap
            .timeline({
                defaults: {
                    duration: 0.5,
                    ease: 'expo'
                }
            })
            .addLabel('start', 0)
            .to(menuItem.DOM.title, {
                x: 0
            }, 'start')
            .fromTo(menuItem.DOM.description, {
                opacity: 0,
                yPercent: 50,
            }, {
                opacity: 1,
                yPercent: 0,
            }, 'start')
            .fromTo(menuItem.thumbGrid.DOM.items, {
                opacity: 0,
                scale: 0.5
            }, {
                stagger: 0.045,
                opacity: 1,
                scale: 1
            }, 'start')
    });

    menuItem.DOM.el.addEventListener('mouseleave', () => {

        menuItem.leaveTL = gsap
            .timeline({
                defaults: {
                    duration: 0.3,
                    ease: 'power3'
                }
            })
            .addLabel('start', 0)
            .to(menuItem.DOM.title, {
                x: 50
            }, 'start')
            .to(menuItem.DOM.description, {
                opacity: 0,
                yPercent: 20
            }, 'start')
            .to(menuItem.thumbGrid.DOM.items, {
                opacity: 0,
                scale: 0.5,
            }, 'start')

    });
};
