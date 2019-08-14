import express from 'express';
import createError from 'http-errors';
import * as bp from 'body-parser';
import mongoose from 'mongoose';
import router from './app/routes';
import config from './app/config/db';
import PassportManager from './app/config/passport';
import PopulateRouter from './app/Populate';
import ClearRouter from './app/Clear';

const app = express();

app.use(bp.urlencoded({extended: true}));
app.use(bp.json());


// Mongoose setup
mongoose.Promise = Promise;
mongoose.connect(config.database, {useNewUrlParser: true});
mongoose.connection.on('error', () => {
  throw new Error('Unable to connect to database.');
});

// Routes setup
app.use('/api', router);
app.use('/db', PopulateRouter);
app.use('/db', ClearRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing errors in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // Render error page
  res.status(err.status || 500); // 500 = internal server error
  res.send(err);
});

app.use((req, res, next) =>{
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Init passport
app.use(PassportManager.initialize());

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Listening on port ' + port));

