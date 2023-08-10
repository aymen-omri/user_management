import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../Models/user_details';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  ngOnInit(): void {
    this.getAllUsers();
    this.myFormGroup.patchValue({
      username: this.data.user.username,
      pwd: this.data.user.pwd,
      display_name: this.data.user.display_name!,
      email: this.data.user.email!,
      designation: this.data.user.designation!,
      role_u: this.data.user.role_u!.toUpperCase(),
    })
  }
  constructor(private userService: UserService, @Inject(MAT_DIALOG_DATA) public data: { user: User }) { }

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

  emailExists(email: string, id: number) {
    let verif: boolean = false;
    this.users.filter((user: any) => {
      if (user.email == email && user.id !== id) {
        verif = true;
      }
    });
    return verif;
  }

  usernameExists(username: string, id: number) {
    let verif: boolean = false;
    this.users.filter((user: any) => {
      if (user.username == username && user.id !== id) {
        verif = true;
      }
    });
    return verif;
  }

  saveUser() {
    if (this.myFormGroup.valid) {
      if (this.usernameExists(this.myFormGroup.value.username!, this.data.user.id)) {
        this.errMessage = "Username Exists";
      } else if (this.emailExists(this.myFormGroup.value.email!, this.data.user.id)) {
        this.errMessage = "Email exists";
      } else {
        this.formData.append('username', this.myFormGroup.value.username!);
        this.formData.append('pwd', this.myFormGroup.value.pwd!);
        this.formData.append('display_name', this.myFormGroup.value.display_name!);
        this.formData.append('role_u', this.myFormGroup.value.role_u!);
        this.formData.append('designation', this.myFormGroup.value.designation!);
        this.formData.append('email', this.myFormGroup.value.email!);

        this.userService.updateUser(this.data.user.id, this.formData).subscribe({
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
      this.errMessage = "Please fill all the boxes!";
    }
  }


}
