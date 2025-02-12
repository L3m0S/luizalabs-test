import { IPaginationOptions, PaginationHelper } from '@application/helpers/Paginationhelper';
import { describe, it, expect } from 'vitest';

describe('PaginationHelper.parsePagination', () => {
	it('should return correct pagination options when valid params are provided', () => {
		const params = { page: 2, pageSize: 20 };
		const skip = params.pageSize * (params.page - 1);
		const result: IPaginationOptions = PaginationHelper.parsePagination(params);

		expect(result).toEqual({
			page: 2,
			pageSize: 20,
			skip: skip,
		});
	});

	it('should use default values when "page" or "pageSize" are zero', () => {
		const params = { page: 0, pageSize: 0 };
		const skip = params.pageSize * (params.page - 1);
		const result: IPaginationOptions = PaginationHelper.parsePagination(params);

		expect(result).toEqual({
			page: 1,
			pageSize: 10,
			skip: Math.abs(+skip),
		});
	});

	it('should throw an error if "page" is negative', () => {
		const params = { page: -1, pageSize: 10 };
		expect(() => PaginationHelper.parsePagination(params)).toThrowError(
			'"page" parameter must be non-negative',
		);
	});

	it('should throw an error if "pageSize" is negative', () => {
		const params = { page: 1, pageSize: -5 };
		expect(() => PaginationHelper.parsePagination(params)).toThrowError(
			'"size" parameter must be non-negative',
		);
	});
});
