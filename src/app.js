import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
import * as database from './database';
import config from '../config';
import errorMiddleware from './middleware/errorMiddleware';
import UserController from './user/UserController';
import UserService from './user/UserService';
import User from './user/User';
import Wallet from './wallet/Wallet';
import WalletService from './wallet/WalletService';
import WalletController from './wallet/WalletController';
import Transaction from './transaction/Transaction';
import TransactionController from './transaction/TransactionController';
import TransactionService from './transaction/TransactionService';
import FavoritePayee from './favoritePayee/FavoritePayee';
import FavoritePayeeController from './favoritePayee/FavoritePayeeController';
import FavoritePayeeService from './favoritePayee/FavoritePayeeService';
import AuthenticationController from './authentication/AuthenticationController';

const app = express();
const db = database.connect(config.db);
app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

const createModels = () => ({
  User: User.init(db),
  Wallet: Wallet.init(db),
  Transaction: Transaction.init(db),
  Payee: FavoritePayee.init(db)
});

const createRouters = () => [
  new UserController(app),
  new WalletController(app),
  new TransactionController(app),
  new AuthenticationController(app),
  new FavoritePayeeController(app)
];

const createServices = models => ({
  userService: new UserService(models),
  walletService: new WalletService(models),
  transactionService: new TransactionService(models),
  payeeService: new FavoritePayeeService(models)
});

const initializeRouters = () => {
  const routers = createRouters();
  routers.forEach((router) => {
    router.registerRouter();
  });
};

const registerDependencies = () => {
  app.locals.models = createModels();
  app.locals.services = createServices(app.locals.models);
};

const initializeAssociation = (models) => {
  models.Wallet.setAssociation(models);
  models.Transaction.setAssociation(models);
  models.Payee.setAssociation(models);
};

registerDependencies();
initializeAssociation(app.locals.models);
initializeRouters();
app.use(errorMiddleware);
export default app;
