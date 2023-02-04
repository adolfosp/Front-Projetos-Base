import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { UserRegistrationModel } from '../model/UserRegistrationModel';

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.scss']
})
export class CaptchaComponent implements OnInit {

  public registerForm!: FormGroup;
  submitted = false;
  reCAPTCHAToken: string = "";
  tokenVisible: boolean = false;
  registrationInfo!: UserRegistrationModel;
  
  constructor(private formBuilder: FormBuilder, private recaptchaV3Service: ReCaptchaV3Service) { }
  
  ngOnInit() {
    this.registerForm = new FormGroup({
      UserName: new FormControl(),
      UserEmailId: new FormControl(),
      password: new FormControl(),
      confirmPassword: new FormControl(),
    })
  }

  onSubmit() {
    this.recaptchaV3Service.execute('importantAction').subscribe((token: string) => {
      this.tokenVisible = true;
      this.reCAPTCHAToken = `Token [${token}] generated`;
    });
  }
}
