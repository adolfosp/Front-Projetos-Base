"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppRoutingModule = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var product_card_component_1 = require("src/cases/auxiliaryRoutes/product-card/product-card.component");
var shopping_card_component_1 = require("src/cases/auxiliaryRoutes/shopping-card/shopping-card.component");
var skeleton_loader_component_1 = require("src/cases/skeleton/skeleton-loader/skeleton-loader.component");
var app_component_1 = require("src/cases/validatorsAsync/app.component");
var track_by_fn_component_1 = require("../cases/trackByFn/track-by-fn/track-by-fn.component");
var captcha_component_1 = require("../cases/captcha/captcha/captcha.component");
var routes = [
    {
        path: 'validatorsAsync',
        component: app_component_1.AppComponentCaseAsyncValidators
    },
    { path: '', component: product_card_component_1.ProductCardComponent, outlet: 'product' },
    { path: '', component: shopping_card_component_1.ShoppingCardComponent, outlet: 'shopping' },
    { path: 'skeleton', component: skeleton_loader_component_1.SkeletonLoaderComponent },
    { path: 'trackByFn', component: track_by_fn_component_1.TrackByFnComponent },
    { path: 'captcha', component: captcha_component_1.CaptchaComponent },
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forRoot(routes)],
            exports: [router_1.RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
