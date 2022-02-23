import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-sing-in',
  templateUrl: './sing-in.component.html',
  styleUrls: ['./sing-in.component.scss'],
})
export class SingInComponent implements OnInit {
  public form: FormGroup;

  public showPassword: boolean = false;

  constructor(
    private FormBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.form = this.FormBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  public ngOnInit(): void {}

  public async submit(event: Event): Promise<void> {
    event.preventDefault();
    const user = await this.authService.signInWithEmailAndPassword(
      this.form.value.email,
      this.form.value.password
    );
    console.log(user);
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

  public async signInWithGoogle() {
    const user = await this.authService.signInWithGoogle();
    console.log(user);
  }
}
