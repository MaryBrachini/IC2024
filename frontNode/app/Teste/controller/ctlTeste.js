// ctlTeste.js

const GetAllTestes = (req, res) => {
    res.send('Hello World - Todos os Testes');
  };
  
  const openTesteInsert = (req, res) => {
    res.send('Hello World - Formulário de Cadastro de Teste');
  };
  
  const openTesteUpdate = (req, res) => {
    res.send('Hello World - Formulário de Atualização de Teste');
  };
  
  const getDados = (req, res) => {
    res.send('Hello World - Dados do Teste');
  };
  
  const insertTeste = (req, res) => {
    res.send('Hello World - Inserção de Teste');
  };
  
  const updateTeste = (req, res) => {
    res.send('Hello World - Atualização de Teste');
  };
  
  const deleteTeste = (req, res) => {
    res.send('Hello World - Remoção de Teste');
  };
  
  module.exports = {
    GetAllTestes,
    openTesteInsert,
    openTesteUpdate,
    getDados,
    insertTeste,
    updateTeste,
    deleteTeste,
  };
  