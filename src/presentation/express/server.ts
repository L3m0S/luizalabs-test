import 'reflect-metadata';
import '../../config/container';
import { AppDataSource } from '@infra/database/Datasource';
import { app } from './app';

const PORT = process.env.PORT || 3333;

AppDataSource.initialize()
	.then(() => {
		console.log('Database connection stablished...');
		app.listen(PORT, () => {
			console.log(`Server running on PORT ${PORT}...`);
		});
	})
	.catch((error) => console.error('Error on connect to database: ', error));
