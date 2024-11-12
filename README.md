# TCC - 2024

## Links uteis
https://docs.streamlit.io/library/api-reference/charts/st.map

solução streamlit
https://github.com/streamlit/streamlit/issues/2397

https://developers.google.com/chart/interactive/docs/gallery/map?hl=pt-br#fullhtml

<details>
<summary> Fazendo a conexão do banco </summary>
  
Dentro do diretorio do Back-end
```
psql -h 127.0.0.1 -U postgres
```
Abrir o Pager Off
```
\pset pager off
```
Abrir o Banco de dados
```
\c vdadosdev postgres
```
Mostrar tabelas
```
\dt
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
</details>

<details>
<summary> Executando o backend</summary>
  
Trocar o IP do Host no srvApp.env para
```
127.0.0.1
```
Para Executar o arquivo do bach
```
./srvApp
```
</details>
  
<details>
<summary> Informações</summary>

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
1. python3.9 -m venv venv <br/>
2. source venv/bin/activate <br/>
3. Instalar: pip3.9 install requests pytest psycopg2 <br/>
4. Fazer o arquivo de teste <br/>
5. Testar com pytest testNomeModulo.py -s <br/>

Usando arquivo requeriments: Dentro do diretório tests fazer:
1. python3.9 -m venv venvNomeAPP <br/>
2. source venvNomeAPP/bin/activate 
3. copiar para dentro do diretório o arquivo requirements.txt <br/>
4. pip3.9 install -r requirements.txt <br/>
5. Copiar um arquivo de teste.py e adaptá-lo para a necessidade <br/>
6. Testar com pytest testNomeModulo.py -s <br/>

</details>
<details>
<summary> Front-End com Google Charts Maps </summary>

### 1- Instalar python

```
```

</details>

<details>
<summary> usando o streamlit</summary>
  
### 1- Instalar python

```
sudo apt install python3-venv 
```
```
apt install virtualenv
```
```
python3 -m venv .venv
```
```
source .venv/bin/activate
```

### 2- Instalar o Streamlit intel
```
pip install streamlit

```
1. Streamlit para arquiteturas AMD 
```
pip install streamlit==0.84
```

2. Se der o erro 
> "TypeError: Descriptors cannot be created directly.
>If this call came from a _pb2.py file, your generated code is out of date and must be regenerated with protoc >= 3.19.0.
>If you cannot immediately regenerate your protos, some other possible workarounds are:
> 1. Downgrade the protobuf package to 3.20.x or lower.
> 2. Set PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION=python (but this will use pure-Python parsing and will be much slower)."
```
pip install protobuf==3.20
```

1. Para testar se está funcionando
```
streamlit hello
```
2. Para desativar o ambiente virtual venv
```
deactivate
```
### 3- Para começar o arquivo do streamlit basta começar com
```
import streamlit as st
```
### 4- Para executar os arquivos
```
streamlit run mapa_app.py
```

Caso precise da biblioteca pandas a versão ideal para streamlit 0.84
```
pip install pandas==1.2.4
```
Caso precise da biblioteca numpy a versão ideal para streamlit 0.84
```
pip install numpy==1.22
```

### 5- Instalar o folium
```
pip install streamlit-folium==0.1.0 folium==0.11.0
```

### 6- Instalar o psycopg2
```
pip install psycopg2
```

</details>

<details>
<summary>Backup Git</summary>
  
### Conectando primeira vez 
```
git config --global user.email "email@email"
```
### Padrão
```
git init
```
```
git add .
```
```
git commit -m "commit"
```
```
git remote add origin "link.git"
```
```
git branch -M main
```
```
git branch -M main
```

### Caso de conflito no push
```
git config pull.rebase false
```
</details>


<details>
<summary>Frontend</summary>
  
### Executando 
```
DEBUG=frontnode:* npm start
```
### 
</details>

<details>
<summary>Anotações</summary>
No relatorio é possivel refazer sua estrutura para otimizar, pegar os dados do periodo selecionado e em cima desses dados gerar os dados com as quantidades, mostrar os graficos e ter a opção de gerar um pdf e CSV
</details>
