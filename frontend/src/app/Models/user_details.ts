export class User {
    id: number;
    username: string;
    pwd: string;
    display_name: string;
    role_u: string;
    designation: string;
    email: string;
    photo_path: string;

    constructor(
        id: number,
        username: string,
        pwd: string,
        display_name: string,
        role_u: string,
        designation: string,
        email: string,
        photo_path: string
    ) {
        this.id = id;
        this.username = username;
        this.pwd = pwd;
        this.display_name = display_name;
        this.role_u = role_u;
        this.designation = designation;
        this.email = email;
        this.photo_path = photo_path;
    }
}

