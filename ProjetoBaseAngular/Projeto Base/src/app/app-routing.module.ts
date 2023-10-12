import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductCardComponent } from 'src/cases/auxiliaryRoutes/product-card/product-card.component';
import { ShoppingCardComponent } from 'src/cases/auxiliaryRoutes/shopping-card/shopping-card.component';
import { SkeletonLoaderComponent } from 'src/cases/skeleton/skeleton-loader/skeleton-loader.component';
import { AppComponentCaseAsyncValidators } from 'src/cases/validatorsAsync/app.component';
import { CaptchaComponent } from '../cases/captcha/captcha/captcha.component';
import { InputChangeComponent } from '../cases/ngModelInputsChange/input-change.component';
import { TrackByFnComponent } from '../cases/trackByFn/track-by-fn/track-by-fn.component';

const routes: Routes = [
  {
    path: 'validatorsAsync',
    component: AppComponentCaseAsyncValidators,
  },

  { path: '', component: ProductCardComponent, outlet: 'product' },
  { path: '', component: ShoppingCardComponent, outlet: 'shopping' },
  { path: 'skeleton', component: SkeletonLoaderComponent },
  { path: 'trackByFn', component: TrackByFnComponent },
  { path: 'captcha', component: CaptchaComponent },
  { path: 'inputModel', component: InputChangeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
