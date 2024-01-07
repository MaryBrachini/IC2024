
DO
$do$
BEGIN 
	IF EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'vdadmin') THEN
	ELSE
	CREATE ROLE
	    vdadmin LOGIN PASSWORD 'p0stdb@!';
	END IF;
	END 
	$do$;


--Criar a banco de dados

select
'
CREATE DATABASE vdadosdev
    WITH 
    OWNER = vdadmin;    
'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'vdadosdev')\gexec

\c vdadosdev vdadmin

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO vdadmin;

SET TIMEZONE TO 'UTC';

--Na Golang, setar o time zone para UTC para não haver problema de diferença de horas
--  loc, err := time.LoadLocation("UTC")
--	time.Local = loc
-- Olhar o programa /home/eajardini/go/src/eajardini/SQL/gorm/postgres2/main.go que eu faço os testes e explico mais detalhes.

CREATE EXTENSION if NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ******** Início Tabelas do Sistema ****** --

-- Table: logregistro
create TABLE if NOT exists logregistro (
    logregistroid uuid default uuid_generate_v4(),
    dataregistro TIMESTAMP not null,
    usuario varchar(30) not null,
    funcaochamadora varchar(40) not null,
    tabela varchar(40) not null,
    operacaosql varchar(20) not null,
    descricao text not null,
    constraint pk_logregistro primary key (logregistroid)    
);
-- ******** Fim Tabelas do Sistema ****** --

-- ******** Início ACL ****** --
CREATE TABLE
    if not exists acluser (
        userid bigserial NOT NULL,
        removido BOOLEAN not null DEFAULT false,
        username VARCHAR(40) NOT NULL,
        password VARCHAR(100) not null,
        datacadastro DATE NOT NULL,
        dataexpiracao DATE,
        userbloqueado boolean NOT NULL,
        trocarsenha boolean,
        CONSTRAINT pk_user PRIMARY KEY (userid),
        CONSTRAINT un_acl_user_login UNIQUE (username)
    );

insert into acluser
values (default, false,'admin', crypt(md5('admin'), gen_salt('bf')), current_date,  NULL, false,false ),
       (default,false,'qwe',crypt(md5('qwe'), gen_salt('bf')),current_date, NULL, false, false)
ON CONFLICT DO NOTHING;

CREATE TABLE
    IF not EXISTS aclgroup (
        groupid bigserial NOT NULL,
        removido BOOLEAN not null DEFAULT false,
        codigogroup VARCHAR(40) NOT NULL,
        tipogroup char NOT NULL, -- Se for grupo puro, o tipo é g, se for grupo de um usuário, o tipo é u.
        nomegroup VARCHAR(70) NOT NULL,        
        CONSTRAINT pk_group PRIMARY KEY (groupid),
        CONSTRAINT un_acl_group_codgroup UNIQUE (codigogroup)
    );

--Table: tabela usada para guardar o usuário e os grupos ao qual pertence.
CREATE table IF NOT EXISTS aclusergroup (
    aclusergroupid  bigserial,
    acluseridfk bigint not null,
    aclgroupidfk bigint  not null,
    constraint pk_aclusergroup PRIMARY KEY (aclusergroupid),
    constraint fk_aclusergroup_user foreign KEY (acluseridfk) references acluser,
    constraint fk_aclusergroup_group foreign KEY (aclgroupidfk) references aclgroup,
    constraint un_aclusergroup unique (acluseridfk, aclgroupidfk));

insert into aclusergroup
values (default, (SELECT userid FROM acluser where username = 'admin'),
        (SELECT groupid FROM aclgroup where codigogroup = 'administrador'))       
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS  aclpessoafisica  (
   pessoafisicaid  BIGINT NOT NULL,   
   removido BOOLEAN not null DEFAULT false,
   nome  VARCHAR(50) Not NULL,
   cep  VARCHAR(10) NULL,
   logradouro  VARCHAR(60) NULL,
   complemento  VARCHAR(40) NULL,
   bairro  VARCHAR(30) NULL,
   cidade  VARCHAR(30) NULL,
   uf  CHAR(2) NULL,
   ibge  VARCHAR(8) NULL,
   gia  VARCHAR(4) NULL,
   ddd  CHAR(2) NULL,
   siafi  VARCHAR(4) NULL,   
  PRIMARY KEY (pessoafisicaid));


INSERT INTO
    aclgroup (codigogroup, nomegroup, tipogroup)
VALUES (
        'administrador',
        'Grupo de administradores do sistema',
        'g'
    ) On conflict
do nothing;

-- ******** Fim ACL ****** --

CREATE TABLE IF NOT EXISTS  vdaestado  (
   estadoid  BIGSERIAL NOT NULL,   
   removido BOOLEAN not null DEFAULT false,   
   nomeestado varchar(30) not null,
   uf char(2) not null,
   CONSTRAINT pk_vdaestado PRIMARY KEY (estadoid),
   CONSTRAINT un_nomeestado unique (nomeestado),
   CONSTRAINT un_uf unique (uf)
);

CREATE TABLE IF NOT EXISTS  vdacidade  (
   cidadeID  BIGSERIAL NOT NULL,   
   removido BOOLEAN not null DEFAULT false,   
   nomeCidade varchar(50) not null,
   estadoIDFK bigint not null,
   CONSTRAINT pk_vdacidade PRIMARY KEY (cidadeID),
   CONSTRAINT un_nomecidade unique (nomeCidade),
   CONSTRAINT fk_vdacidade_vdaestado FOREIGN KEY(estadoIDFK)
    REFERENCES vdaestado
);

--@ O bairro não precisa estar amarrado a uma cidade. 
--@ Serve apenas para fins de Filtro no Dashboard.
CREATE TABLE IF NOT EXISTS  vdabairro  (
   bairroid  BIGSERIAL NOT NULL,   
   removido BOOLEAN not null DEFAULT false,
   codigobairro varchar(15) not null,
   nomebairro varchar(30) not null,
   CONSTRAINT pk_vdabairro PRIMARY KEY (bairroid),
   CONSTRAINT un_codigobairro unique (codigobairro),
   CONSTRAINT un_nomebairro unique (nomebairro)
);

CREATE TABLE IF NOT EXISTS  vdaepidemia  (
   epidemiaid  BIGSERIAL NOT NULL,   
   removido BOOLEAN not null DEFAULT false,   
   nomeepidemia varchar(30) not null,
   CONSTRAINT pk_vdaepidemia PRIMARY KEY (epidemiaid),
   CONSTRAINT un_nomeepidemia unique (nomeepidemia)
);

CREATE TABLE IF NOT EXISTS  vdalogradouro  (
   logradouroid  BIGSERIAL NOT NULL,   
   removido BOOLEAN not null DEFAULT false,   
   nomelogradouro varchar(50) not null,
   cidadeidfk BIGINT not null,
   CONSTRAINT pk_vdalogradouro PRIMARY KEY (logradouroid),
   CONSTRAINT un_nomelogradouro unique (nomelogradouro,cidadeidfk),    
   CONSTRAINT fk_vdalogradouro_vdacidade FOREIGN KEY(cidadeidfk)
    REFERENCES vdacidade
);

CREATE TABLE IF NOT EXISTS  vdaunidbasicasaude  (
    unidBasicaSaudeID bigserial not NULL,
    removido BOOLEAN not null DEFAULT false,
    codigoUBS varchar(20) not NULL,
    nomeUBS varchar(30) NOT NULL,
    bairroIDFK BIGINT NOT NULL,
    CONSTRAINT pk_vdaUnidadeSaude PRIMARY KEY (unidBasicaSaudeID),
    CONSTRAINT un_codigoUBS unique (codigoUBS),    
    CONSTRAINT un_nomeUS unique (nomeUBS),    
    CONSTRAINT fk_vdaunidbasicasaude_bairro FOREIGN KEY(bairroIDFK)
        REFERENCES vdabairro
);

CREATE TABLE IF NOT EXISTS  vdaocorrencia  (
   ocorrenciaid  BIGSERIAL NOT NULL,   
   removido BOOLEAN not null DEFAULT false,
   unidBasicaSaudeIDFK BIGINT not null,
   nomeSuspeito varchar(40) not null,  
   datacadastro date not null,
   dataocorrencia TIMESTAMP not null,
   epidemiaidfk bigint not null,   
   logradouroidfk bigint not null,
   numero int NOT NULL,
   latitude double precision not null,
   longitude double precision not null,
   bairroidfk bigint not null,
   localTrabalho varchar(50) NULL,
   logradouroLocalTrabalhoIDFK bigint NULL,
   numeroLocalTrabalho int NULL,
   latitudeLocalTrabalho double precision null,
   longitudeLocalTrabalho double precision null,
   CONSTRAINT pk_vdaocorrencia PRIMARY KEY (ocorrenciaid),
   CONSTRAINT fk_vdaocorrencia_vdaepidemia FOREIGN KEY (epidemiaidfk) REFERENCES vdaepidemia,
   CONSTRAINT fk_vdaocorrencia_vdalogradouro FOREIGN KEY (logradouroidfk) REFERENCES vdalogradouro,
   CONSTRAINT fk_vdaocorrencia_vdalogradourotrab FOREIGN KEY (logradouroLocalTrabalhoIDFK) REFERENCES vdalogradouro,
   CONSTRAINT fk_vdaocorrencia_vdabairro FOREIGN KEY (bairroidfk) REFERENCES vdabairro,
   CONSTRAINT fk_vdaocorrencia_vdaunidbasicasaude FOREIGN KEY (unidBasicaSaudeIDFK) REFERENCES vdaunidbasicasaude
);



