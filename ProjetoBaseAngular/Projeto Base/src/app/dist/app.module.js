"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var http_1 = require("@angular/common/http");
var app_routing_module_1 = require("./app-routing.module");
var app_component_1 = require("./app.component");
var forms_1 = require("@angular/forms");
var app_component_2 = require("../cases/validatorsAsync/app.component");
var product_card_component_1 = require("../cases/auxiliaryRoutes/product-card/product-card.component");
var shopping_card_component_1 = require("../cases/auxiliaryRoutes/shopping-card/shopping-card.component");
var ngx_skeleton_loader_1 = require("ngx-skeleton-loader");
var skeleton_loader_component_1 = require("src/cases/skeleton/skeleton-loader/skeleton-loader.component");
var track_by_fn_component_1 = require("src/cases/trackByFn/track-by-fn/track-by-fn.component");
var ng_recaptcha_1 = require("ng-recaptcha");
var environment_1 = require("src/environments/environment");
var captcha_component_1 = require("../cases/captcha/captcha/captcha.component");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                app_component_2.AppComponentCaseAsyncValidators,
                product_card_component_1.ProductCardComponent,
                shopping_card_component_1.ShoppingCardComponent,
                skeleton_loader_component_1.SkeletonLoaderComponent,
                track_by_fn_component_1.TrackByFnComponent,
                captcha_component_1.CaptchaComponent
            ],
            imports: [
                platform_browser_1.BrowserModule,
                app_routing_module_1.AppRoutingModule,
                http_1.HttpClientModule,
                ngx_skeleton_loader_1.NgxSkeletonLoaderModule,
                forms_1.ReactiveFormsModule
            ],
            providers: [
                ng_recaptcha_1.ReCaptchaV3Service,
                {
                    provide: ng_recaptcha_1.RECAPTCHA_V3_SITE_KEY,
                    useValue: environment_1.environment.recaptcha.siteKey
                },
            ],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
