import { ApiError } from './ApiError';

export interface IPaginationOptions {
	page: number;
	pageSize: number;
	skip: number;
}

export class PaginationHelper {
	static parsePagination(params: { page: number; pageSize: number }): IPaginationOptions {
		const DEFAULT_PAGE = 1;
		const DEFAULT_PAGE_SIZE = 10;

		if (params?.page < 0) {
			throw new ApiError('"page" parameter must be non-negative', 400);
		}

		if (params?.pageSize < 0) {
			throw new ApiError('"size" parameter must be non-negative', 400);
		}

		const pageSize = params?.pageSize || DEFAULT_PAGE_SIZE;
		const page = params?.page || DEFAULT_PAGE;

		const skip = Math.abs(+pageSize * (page - 1));

		return {
			page: page,
			pageSize,
			skip,
		};
	}
}
