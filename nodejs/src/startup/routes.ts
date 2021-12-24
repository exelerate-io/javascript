import cors from 'cors';
import express from 'express';
import error from '../middleware/error';

const routes = (app: express.Express) => {
	app.use(cors({ origin: true }));
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use('/api/v1', monitoring);
	app.use(error);
};

export default routes;
