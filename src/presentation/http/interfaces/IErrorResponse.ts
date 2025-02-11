export interface IErrorResponse {
	type: string;
	status: number;
	title: string;
	detail?: string;
	instance: string;
}
