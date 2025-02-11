import 'reflect-metadata';
import '../../config/container';
import { AppDataSource } from '@infra/database/Datasource';
import { app } from './app';

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
	AppDataSource.initialize()
		.then(() => console.log('Database connection stablished...'))
		.catch((error) => console.error('Error on connect to database: ', error));
	console.log(`Server running on PORT ${PORT}...`);
});
