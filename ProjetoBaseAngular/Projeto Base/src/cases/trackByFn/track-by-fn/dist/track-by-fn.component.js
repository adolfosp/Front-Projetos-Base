"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TrackByFnComponent = void 0;
var core_1 = require("@angular/core");
var TrackByFnComponent = /** @class */ (function () {
    function TrackByFnComponent() {
        this.collection = [];
        this.collection = [{ id: 1 }, { id: 2 }, { id: 3 }];
    }
    TrackByFnComponent.prototype.getItems = function () {
        this.collection = this.getItemsFromServer();
    };
    TrackByFnComponent.prototype.getItemsFromServer = function () {
        return [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
    };
    TrackByFnComponent.prototype.trackByFn = function (index, item) {
        return index;
    };
    TrackByFnComponent = __decorate([
        core_1.Component({
            selector: 'app-track-by-fn',
            templateUrl: './track-by-fn.component.html',
            styleUrls: ['./track-by-fn.component.scss']
        })
    ], TrackByFnComponent);
    return TrackByFnComponent;
}());
exports.TrackByFnComponent = TrackByFnComponent;
