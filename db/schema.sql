### Schema

CREATE DATABASE clubbr;
USE clubbr;

CREATE TABLE events
(
	id int NOT NULL AUTO_INCREMENT,
	user_id int NOT NULL,
	name varchar(255) NOT NULL,
	genre varchar(255) NOT NULL,
	venue varchar(255) NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE users
(
	id int NOT NULL AUTO_INCREMENT,
	username varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	password_hash varchar(255) NOT NULL,
	PRIMARY KEY (id)
);
