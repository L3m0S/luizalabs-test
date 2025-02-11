import { Request, Response, NextFunction, RequestHandler } from 'express';

export const requestBodyTypeHandler: RequestHandler = (
	req: Request,
	res: Response,
	next: NextFunction,
): any => {
	if (
		req.method !== 'GET' &&
		req.method !== 'DELETE' &&
		!req.headers['content-type']!?.includes('application/json')
	) {
		return res.status(415).json({ message: 'Content-Type must be application/json' });
	}
	next();
};
