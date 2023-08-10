create database hello ;
use hello;
create table user_details(
id int primary key auto_increment,
username varchar(255) not null,
pwd varchar(255) not null,
display_name varchar(255),
role_u varchar(255),
designation varchar(255),
email varchar(255),
photo_path varchar(1000)
); 
insert into user_details (username,pwd,display_name , role_u , designation , email , photo_path) values ("admin","admin123","admin admin","ADMIN","xxx","admin@gmail.com","uploads\\avatar1.png");