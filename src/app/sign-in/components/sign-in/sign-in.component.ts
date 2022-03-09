import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  public form: FormGroup;
  public isLoading = false;

  public showPassword: boolean = false;

  constructor(
    private FormBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.FormBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  public ngOnInit(): void {}

  public async submit(event: Event): Promise<void> {
    this.isLoading = true;
    event.preventDefault();
    const user = await this.authService.signInWithEmailAndPassword(
      this.form.value.email,
      this.form.value.password
    );
    this.isLoading = false;
    if (user) {
      this.router.navigate(['/']);
    }
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
    try {
      this.isLoading = true;
      const user = await this.authService.signInWithGoogle();
      this.isLoading = false;
      if (user) {
        this.router.navigate(['/']);
      }
    } catch (error) {
      this.isLoading = false;
      console.error(error);
    }
  }
}
