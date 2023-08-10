import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../Models/user_details';
import { UserService } from '../../services/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { UpdateUserComponent } from '../update-user/update-user.component';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  ngOnInit(): void {
    this.getAllUsers();
  }

  constructor(private userService: UserService, private dialog: MatDialog) { }

  users: User[] = [];
  displayedColumns: string[] = ['photo', 'username', 'display_name', 'email', 'details', 'actions'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  getAllUsers() {
    this.userService.getAllUsers().subscribe((data: any) => {
      this.users = data.data;
      this.dataSource = new MatTableDataSource<any>(this.users);
      this.dataSource.paginator = this.paginator;
    })
  }

  search: string = "";
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data.username.toLowerCase().includes(filter.trim().toLowerCase());
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  seeMore(user: User) {
    this.dialog.open(UserDetailsComponent, {
      width: '500px',
      data: { user: user }
    })
  }

  successMsg: string = "";

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe((data: any) => {
      console.log(data);
      this.getAllUsers();
      this.successMsg = "Deleted successfully!";
    });
  }

  updateUser(user: User) {
    this.dialog.open(UpdateUserComponent, {
      maxWidth: '600px',
      data: { user: user }
    })
  }

  downloadPDF() {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [this.getHeaders()],
      body: this.getData(),
    })
    doc.save('users.pdf');
  }

  downloadExcel() {
    const data = this.dataSource.data;
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'users');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  }


  getHeaders() {
    return ['id', 'username', 'display name', 'email', 'password', 'designation', 'role', 'photo path'];
  }

  // Example function to get table data
  getData() {
    return this.dataSource.data.map((item: any) => [item.id, item.username, item.display_name, item.email, item.pwd, item.designation, item.role_u, item.photo_path]);
  }




}
