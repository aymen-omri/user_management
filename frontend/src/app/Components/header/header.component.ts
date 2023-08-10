import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  ngOnInit(): void {
    this.verifLoggedIn()
  }
  constructor(private authService: AuthService) { }
  isLoggedIn: boolean | undefined;

  verifLoggedIn() {
    if (this.authService.isLoggedIn()) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    window.location.replace('login');
  }

}
