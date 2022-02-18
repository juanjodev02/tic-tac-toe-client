import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sing-in',
  templateUrl: './sing-in.component.html',
  styleUrls: ['./sing-in.component.scss'],
})
export class SingInComponent implements OnInit {
  public form: FormGroup;

  public showPassword: boolean = false;

  constructor(private FormBuilder: FormBuilder) {
    this.form = this.FormBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  public ngOnInit(): void {}

  public submit(event: Event): void {
    event.preventDefault();
    console.log(this.form.value);
  }

  public getInputType(): string {
    if (this.showPassword) {
      return 'text';
    }
    return 'password';
  }

  public toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }
}
