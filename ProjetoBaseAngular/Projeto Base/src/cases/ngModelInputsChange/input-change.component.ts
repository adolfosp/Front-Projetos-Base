import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-input-change',
  templateUrl: './input-change.component.html',
  styleUrls: ['./input-change.component.scss'],
})
export class InputChangeComponent implements OnInit {
  public texto1: number | undefined;
  public texto2: number | undefined;

  constructor() {}

  ngOnInit(): void {}

  public onChangeText2(texto: any) {
    this.texto1 = texto.value * 2;
  }

  public onChangeText1(texto: any) {
    this.texto2 = texto.value;
  }

}
