"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CaptchaComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var CaptchaComponent = /** @class */ (function () {
    function CaptchaComponent(formBuilder, recaptchaV3Service) {
        this.formBuilder = formBuilder;
        this.recaptchaV3Service = recaptchaV3Service;
        this.submitted = false;
        this.reCAPTCHAToken = "";
        this.tokenVisible = false;
    }
    CaptchaComponent.prototype.ngOnInit = function () {
        this.registerForm = new forms_1.FormGroup({
            UserName: new forms_1.FormControl(),
            UserEmailId: new forms_1.FormControl(),
            password: new forms_1.FormControl(),
            confirmPassword: new forms_1.FormControl()
        });
    };
    CaptchaComponent.prototype.onSubmit = function () {
        var _this = this;
        this.recaptchaV3Service.execute('importantAction').subscribe(function (token) {
            _this.tokenVisible = true;
            _this.reCAPTCHAToken = "Token [" + token + "] generated";
        });
    };
    CaptchaComponent = __decorate([
        core_1.Component({
            selector: 'app-captcha',
            templateUrl: './captcha.component.html',
            styleUrls: ['./captcha.component.scss']
        })
    ], CaptchaComponent);
    return CaptchaComponent;
}());
exports.CaptchaComponent = CaptchaComponent;
