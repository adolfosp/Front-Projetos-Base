import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponentCaseAsyncValidators } from '../cases/validatorsAsync/app.component';
import { ProductCardComponent } from '../cases/auxiliaryRoutes/product-card/product-card.component';
import { ShoppingCardComponent } from '../cases/auxiliaryRoutes/shopping-card/shopping-card.component';

import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SkeletonLoaderComponent } from 'src/cases/skeleton/skeleton-loader/skeleton-loader.component';
import { TrackByFnComponent } from 'src/cases/trackByFn/track-by-fn/track-by-fn.component';
import { ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';
import { CaptchaComponent } from '../cases/captcha/captcha/captcha.component';
import { InputChangeComponent } from '../cases/ngModelInputsChange/input-change.component';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSkeletonLoaderModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    ReCaptchaV3Service,
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.recaptcha.siteKey,
    },],
  bootstrap: [AppComponent],
})
export class AppModule {}
