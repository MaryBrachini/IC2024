// DEBUG=dw3frontnode:* npm start

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');

require('dotenv').config();

var testeRouter = require('./routes/rte_Teste'); // Atualizado
var indexRouter = require('./routes/index');
var bairroRouter = require('./routes/rte_Bairro');
var epidemiaRouter = require('./routes/rte_Epidemia');
var estadoRouter = require('./routes/rte_Estado');
var cidadeRouter = require('./routes/rte_Cidade');
var logradouroRouter = require('./routes/rte_Logradouro');
var ubsRouter = require('./routes/rte_UBS');
var ocorrenciasRouter = require('./routes/rte_Ocorrencias');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'vash');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //Necessário para obter os valores das variáveis via POST
app.use(cookieParser());
//app.use( bodyParser.urlencoded({ extended: false, }))

app.use(
  session({
    secret: "palavrasecreta",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: null },
  })
);


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/teste', testeRouter); // Atualizado para "teste"
app.use('/bairro', bairroRouter);
app.use('/epidemia', epidemiaRouter);
app.use('/estado', estadoRouter);
app.use('/cidade', cidadeRouter);
app.use('/logradouro', logradouroRouter);
app.use('/UBS', ubsRouter);
app.use('/Ocorrencias', ocorrenciasRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;