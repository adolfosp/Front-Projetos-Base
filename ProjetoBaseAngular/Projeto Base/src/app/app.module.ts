import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ProductCardComponent } from '../cases/auxiliaryRoutes/product-card/product-card.component';
import { ShoppingCardComponent } from '../cases/auxiliaryRoutes/shopping-card/shopping-card.component';
import { AppComponentCaseAsyncValidators } from '../cases/validatorsAsync/app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AsyncPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RECAPTCHA_V3_SITE_KEY, ReCaptchaV3Service } from 'ng-recaptcha';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SkeletonLoaderComponent } from 'src/cases/skeleton/skeleton-loader/skeleton-loader.component';
import { TrackByFnComponent } from 'src/cases/trackByFn/track-by-fn/track-by-fn.component';
import { environment } from 'src/environments/environment';
import { CaptchaComponent } from '../cases/captcha/captcha/captcha.component';
import { InputChangeComponent } from '../cases/ngModelInputsChange/input-change.component';
import { ListDraggableDirective } from './list-draggable.directive';

@NgModule({
  declarations: [
    AppComponent,
    AppComponentCaseAsyncValidators,
    ProductCardComponent,
    ShoppingCardComponent,
    SkeletonLoaderComponent,
    TrackByFnComponent,
    CaptchaComponent,
    InputChangeComponent,
    ListDraggableDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSkeletonLoaderModule,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  providers: [
    ReCaptchaV3Service,
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.recaptcha.siteKey,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
