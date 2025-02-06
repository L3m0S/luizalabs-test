import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';

const app = express();

app.use(helmet());
app.disable('x-powered-by');
app.use(cors());

app.use(morgan(`tiny`));
app.use(express.json());
app.use(compression());

app.listen(3333, async () => {
    console.log('Server running on PORT 3333...');
});