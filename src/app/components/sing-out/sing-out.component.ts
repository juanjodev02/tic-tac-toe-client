import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-sing-out',
  templateUrl: './sing-out.component.html',
  styleUrls: ['./sing-out.component.scss'],
})
export class SingOutComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.signOut().then(() => {
      this.router.navigate(['/sign-in']);
    });
  }
}
