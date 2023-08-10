import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/Models/user_details';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  ngOnInit(): void {
    this.getAllUsers();
  }
  constructor(private userService: UserService) { }

  myFormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    pwd: new FormControl('', Validators.required),
    display_name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    designation: new FormControl('', Validators.required),
    role_u: new FormControl('', Validators.required),
  });

  roles: string[] = ['ADMIN', 'USER'];

  formData: FormData = new FormData();

  fileSaved: boolean = false;

  errMessage: string = "";

  users: User[] = [];

  onFilesSelected(event: any) {
    this.formData.append('image', event.target.files[0]);
    this.fileSaved = true;
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe((data: any) => {
      this.users = data.data;
    });
  }

  emailExists(email: string) {
    let verif: boolean = false;
    this.users.filter((user: any) => {
      if (user.email == email) {
        verif = true;
      }
    });
    return verif;
  }

  usernameExists(username: string) {
    let verif: boolean = false;
    this.users.filter((user: any) => {
      if (user.username == username) {
        verif = true;
      }
    });
    return verif;
  }

  saveUser() {
    if (this.myFormGroup.valid && this.fileSaved) {
      if (this.usernameExists(this.myFormGroup.value.username!)) {
        this.errMessage = "Username Exists";
      } else if (this.emailExists(this.myFormGroup.value.email!)) {
        this.errMessage = "Email exists";
      } else {
        this.formData.append('username', this.myFormGroup.value.username!);
        this.formData.append('pwd', this.myFormGroup.value.pwd!);
        this.formData.append('display_name', this.myFormGroup.value.display_name!);
        this.formData.append('role_u', this.myFormGroup.value.role_u!);
        this.formData.append('designation', this.myFormGroup.value.designation!);
        this.formData.append('email', this.myFormGroup.value.email!);

        this.userService.addUser(this.formData).subscribe({
          next: (data: any) => {
            console.log(data);
            window.location.replace('/users_list');
          },
          error: (error) => {
            this.errMessage = "Something went wrong!";
          },
          complete: () => {
            console.log("Complete!");
          }
        });
      }
    } else {
      this.errMessage = "Fill all boxes!";
    }
  }


}
