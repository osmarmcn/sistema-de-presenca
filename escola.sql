create database escola;

use escola;

drop table professor;
drop table monitor;
drop table academico;

CREATE TABLE professor (
    id INT PRIMARY KEY auto_increment,
    nome VARCHAR(100) not null,
    email VARCHAR(100) not null,
    cargo varchar(50) not null,
    senha VARCHAR(100) not null
);


CREATE TABLE monitor (
    id INT PRIMARY KEY auto_increment,
    nome VARCHAR(100) not null,
    email VARCHAR(100) not null,
    cargo varchar(50) not null,
    senha VARCHAR(100)
);


CREATE TABLE academico (
    id INT PRIMARY KEY auto_increment,
    nome VARCHAR(100) not null,
    email VARCHAR(100) not null,
    cargo varchar(50) not null,
    senha VARCHAR(100) not null
);

CREATE TABLE turma1 (
    id INT PRIMARY KEY auto_increment,
    nome VARCHAR(100) not null,
    email VARCHAR(100) not null,
    notas JSON,
    media DECIMAL(4,2) not null,
    status ENUM('Aprovado', 'Recuperação'),
    presença INT,
    faltas INT
);


CREATE TABLE turma2 (
    id INT PRIMARY KEY auto_increment,
    nome VARCHAR(100) not null,
    email VARCHAR(100) not null,
    notas JSON,
    media DECIMAL(4,2) not null,
    status ENUM('Aprovado', 'Recuperação') not null,
    presença INT,
    faltas INT 
);

INSERT INTO professor (id, nome, email,cargo, senha) VALUES
(1, 'John', 'john@gmail.com', 'professor', '1234'),
(2, 'Ana', 'ana@gmail.com', 'professor','5678');

INSERT INTO monitor (id, nome, email,cargo, senha) VALUES
(1, 'Joao', 'joao@gmail.com', 'monitor','1235'),
(2, 'Amanda', 'amanda@gmail.com', 'monitor','5679');

insert into academico (id, nome, email,cargo, senha) VALUES
(1, 'Pedro', 'pedro@gmail.com', 'academico','5670' ),
(2, 'Maria', 'maria@gmail.com', 'academico','1236');


INSERT INTO turma1 (id, nome, email, notas, media, status, presença, faltas) VALUES
(1, 'Roberta Oliveira', 'roberta.oliveira@gmail.com', '["7.0", "6.5", "8.0", "7.0*2"]', 6.8, 'Recuperação', 0, 0),
(2, 'Fernando Souza', 'fernando.souza@gmail.com', '["8.5", "7.5", "8.0", "8.0*2"]', 8.0, 'Aprovado', 0, 0);

INSERT INTO turma2 (id, nome, email, notas, media, status, presença, faltas) VALUES
(1, 'Ana Silva', 'ana.silva@gmail.com', '["9.0", "8.5", "9.0", "8.0*2"]', 8.8, 'Aprovado', 0, 0);