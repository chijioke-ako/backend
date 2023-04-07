--  CREATE DATABASE teqbridgeltddb;
CREATE TABLE test(
    id BIGSERIAL NOT NULL,
    name VARCHAR(255) DEFAULT NULL
);
CREATE TABLE partners(
    id BIGSERIAL NOT NULL,
    name VARCHAR(255) DEFAULT NULL,
    logo VARCHAR(255) NOT NULL,
    profile VARCHAR(5000) DEFAULT NULL,
    url VARCHAR(255) DEFAULT NULL
);
CREATE TABLE pcms(
    id BIGSERIAL NOT NULL,
    name VARCHAR(255) DEFAULT NULL,
    company VARCHAR(255) NOT NULL,
    telephone VARCHAR(255) DEFAULT NULL,
    email VARCHAR(255) DEFAULT NULL
);
CREATE TABLE openbravo(
    id BIGSERIAL NOT NULL,
    name VARCHAR(255) DEFAULT NULL,
    company VARCHAR(255) NOT NULL,
    telephone VARCHAR(255) DEFAULT NULL,
    email VARCHAR(255) DEFAULT NULL
);
CREATE TABLE contact(
    id BIGSERIAL NOT NULL,
    fullname VARCHAR(255) DEFAULT NULL,
    email VARCHAR(255) DEFAULT NULL,
    telephone BIGINT NULL DEFAULT NULL,
    message VARCHAR(5000) NOT NULL
);
CREATE TABLE users(
    id BIGSERIAL NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL
);
CREATE TABLE publications(
    id BIGSERIAL NOT NULL,
    date_created DATE NOT NULL DEFAULT CURRENT_DATE,
    last_date_updated DATE NOT NULL DEFAULT CURRENT_DATE,
    title VARCHAR(255) NOT NULL,
    sub_title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    feature_image VARCHAR(255) NOT NULL,
    feature_image_caption VARCHAR(255) NOT NULL,
    body VARCHAR(5000) NOT NULL
);
CREATE TABLE resume(
    id BIGSERIAL NOT NULL,
    surname VARCHAR(255) DEFAULT NULL,
    firstname VARCHAR(255) DEFAULT NULL,
    email VARCHAR(255) DEFAULT NULL,
    resume VARCHAR(255) NOT NULL,
    coverletter VARCHAR(5000) DEFAULT NULL,
    datesubmitted DATE NOT NULL DEFAULT CURRENT_DATE
);
-- CREATE TYPE roles AS ENUM('user', 'admin');
--    CREATE TABLE users (\dt
--     id SERIAL PRIMARY KEY,
--     firstname VARCHAR(255),
--     lastname VARCHAR(255),
--     email VARCHAR(255),
--     password VARCHAR(255),
--     role roles);