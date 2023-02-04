import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
})
export class AppComponentCaseAsyncValidators {
  public myControl = new FormControl('');

  constructor(private http: HttpClient) {
    this.myControl.addAsyncValidators(this.validateStockSymbol);
  }

  validateStockSymbol = (
    control: AbstractControl
  ): Observable<ValidationErrors | null> => {
    if (control.value?.length >= 1) {
      const symbol = control.value.toUpperCase();
      const url = `https://finnhub.io/api/v1/search?q=${symbol}&token=bu4f8kn48v6uehqi3cqg`;

      return this.http
        .get<any>(url)
        .pipe(
          map((res: any) =>
            res?.result?.find((stock: any) => stock.symbol.startsWith(symbol))
              ? null
              : { error: 'No matching symbol found' }
          )
        );
    } else {
      return of({ error: 'No symbol entered' });
    }
  };
}
