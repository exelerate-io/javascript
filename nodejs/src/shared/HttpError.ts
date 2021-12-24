import { getReasonPhrase } from 'http-status-codes';

class HttpError extends Error {
	httpStatusCode: string | number;

	code: any;

	details: any;

	constructor(httpStatusCode: string | number, details: any, code?: any) {
		super(getReasonPhrase(httpStatusCode));
		this.httpStatusCode = httpStatusCode;
		this.details = details;
		this.code = code;
	}
}

export default HttpError;
