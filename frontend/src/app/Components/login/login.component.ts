import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  ngOnInit(): void {
  }

  constructor(private authService: AuthService) { }

  myFormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    pwd: new FormControl('', [Validators.required])
  });

  errorMessage: string = "";

  loginUser() {
    if (this.myFormGroup.valid) {
      this.authService.login(this.myFormGroup.value).subscribe({
        next: (value: any) => {
          console.log(value.data);
          if (value.data.role_u == 'USER') {
            this.errorMessage = "You are not allowed to access users details!";
          } else {
            this.authService.saveUsernameToLocalStorage(value.data.username);
            window.location.replace('/users_list');
          }
        },
        error: (error: any) => {
          console.log(error)
          this.errorMessage = "Wrong email or password!";

        },
        complete: () => {
          console.log("Complete!");
        }
      });
    } else {
      this.errorMessage = "Something went wrong!";
    }
  }

}
