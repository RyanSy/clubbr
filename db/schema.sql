### Schema

CREATE DATABASE clubbr;
USE clubbr;

CREATE TABLE users
(
	id int NOT NULL AUTO_INCREMENT,
	username varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	password_hash varchar(255) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE events
(
	id int NOT NULL AUTO_INCREMENT,
	name varchar(255) NOT NULL,
	djs varchar(255) NOT NULL,
	genre varchar(255) NOT NULL,
	venue varchar(255) NOT NULL,
	address varchar(255) NOT NULL,
	phone varchar(255) NOT NULL,
	hours varchar(255) NOT NULL,
	reservations varchar(255) NOT NULL,
	PRIMARY KEY (id)
);
