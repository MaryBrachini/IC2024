# TCC - Controle de dengue 2024

## Fazendo a conexão do banco
Dentro do diretorio do Back-end
```
psql -h 127.0.0.1 -U postgres
```

Abrir o Pager Off
```
\pset pager off
```

Para criar o database 
```
\i createDatabaseVDados.sql
```

Senha Database
```
p0stdb@!
```
Após isso será criado o SQL


#################################################################################################################
## Executando o backend
Trocar o IP do Host no srvApp.env para ```127.0.0.1```

Para Executar o arquivo do bach
```
./srvApp
```

#################################################################################################################
## Informações

#Lista as Tabelas
```
\dt
```

# srvApp
Servidor de login, usuários, grupos e direitos

# Lista de comando úteis no Git
https://gist.github.com/leocomelli/2545add34e4fec21ec16

# sincronizar o repositório LOCAL com o ONLINE. Fazer isso toda vez que for terminar um dia de trabalho.
```
git add .
```
```
git commit -m "first commit"
```
```
git push -u origin main 
``` 

# sincronizar o repositório ONLINE com o LOCAL. Fazer isso toda vez que for iniciar o trabalho.
```git pull```  aqui eu faço um pull do main. se existir branchs, vai dar pau.<br />
```git pull origin nomeDoBranch```  - aqui eu faço um de um branch que eu estou<br />

# criar branchs

```git checkout -b jwtRotina```    -> cria um branch Local chamado de jwtRotina <br />
```git push origin jwtRotina```    -> cria um branch no Github chamado de jwRotina  <br />


# fazer merge do brach

Considerando que eu estou no branch jwtRotina

```git checkout main```
```git merge jwtRotina```
```git push -u origin main```

# Saber o branch ativo
```
git branch
```

# Apagando um branch
```
git branch -d nomeBranch
```

# Apagando uma branch(Ramificação) remota
```
git push origin
```
--delete nomeBrach

# Usuarios
```
git config user.name
```
-> Mostra o usuário configurado
```
git config user.email
```
-> Mostra o e-mail configurado
```
git config --global user.email "email"
``` 
-> seta o usuario


# Teste com pytest
Para rodar o arquivo Executável no Windows:



1) Descompacte o ZIP em um diretório qualquer.

2) Abra o PGADMIN e carreque o arquivo createDatabaseVDados.sql

3) O arquivo cria um usuário e um  database chamados de vdados

4) As tabelas devem ser criadas dentro deste database

5) Abra o arquivo srvApp.env e altere o endereço IP do postgres. O srvApp.exe usará este arquivo para saber onde o postgres está.

6) Rode o arquivo srvApp.exe e torça os dedos que tudo dará certo.

7) Abra o VSCode e rode os testes de API que está no  arquivo testOcorrencia.rest. 

8) Se você conseguiir chegar até aqui a gente avança para a próxima fase.


## Dentro do diretório tests

Sem usar arquivo requeriments: Dentro do diretório tests fazer:
1 - python3.9 -m venv venv <br/>
2 - source venv/bin/activate <br/>
3 - Instalar: pip3.9 install requests pytest psycopg2 <br/>
4 - Fazer o arquivo de teste <br/>
5- Testar com pytest testNomeModulo.py -s <br/>

Usando arquivo requeriments: Dentro do diretório tests fazer:
1 - python3.9 -m venv venvNomeAPP <br/>
2 - source venvNomeAPP/bin/activate 
3 - copiar para dentro do diretório o arquivo requirements.txt <br/>
4 - pip3.9 install -r requirements.txt <br/>
5 - Copiar um arquivo de teste.py e adaptá-lo para a necessidade <br/>
6- Testar com pytest testNomeModulo.py -s <br/>







## usando o streamlit 

### 1- Instalar python
```
```
### 2- Instalar o Streamlit
```
pip install streamlit

```
### 3- Para começar o arquivo do streamlit basta começar com
```
import streamlit as st
```
### 
```
```
### 
```
```
### 
```
```
