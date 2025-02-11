import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { IErrorResponse } from '@presentation/http/interfaces/IErrorResponse';
import { ApiError } from '@application/helpers/ApiError';

const errorHandler: ErrorRequestHandler = (
	error: Error & Partial<ApiError>,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const DEFAULT_STATUS_CODE = 500;
	const DEFAULT_ERROR_MESSAGE = 'Internal Server Error';

	const statusCode = error?.statusCode ?? DEFAULT_STATUS_CODE;

	const errorMessage: IErrorResponse = {
		type: error.name,
		status: statusCode,
		title: error?.message ?? DEFAULT_ERROR_MESSAGE,
		detail: error.message,
		instance: req.url,
	};

	console.log(error);
	res.status(statusCode).json({ message: errorMessage });
};

export { errorHandler };
