export interface ResponseData {
  statusCode: number;
  status: boolean;
  message?: string;
  data?: any;
  error?: string;
}

export const BaseResponse = (
  resMessage: string,
  type: string,
  result: any = null,
) => {
  let responseData;
  let status = 200; // Default status code

  switch (type) {
    case 'created':
      responseData = { statusCode: 201, status: true, message: resMessage };
      break;
    case 'success':
      responseData = { statusCode: 200, status: true, message: resMessage, data: result };
      break;
    case 'unauthorized':
      responseData = { statusCode: 403, status: false, error: resMessage };
      break;
    case 'badRequest':
      responseData = { statusCode: 400, status: false, error: resMessage };
      break;
    case 'notFound':
      responseData = { statusCode: 404, status: false, error: resMessage };
      break;
    case 'tooManyRequests':
      responseData = { statusCode: 429, status: false, error: resMessage };
      break;
    case 'paymentRequired':
      responseData = { statusCode: 402, status: false, error: resMessage };
      break;
    case 'internalServerError':
      responseData = { statusCode: 500, status: false, error: resMessage };
      break;
    default:
      responseData = { statusCode: 200, status: true, message: resMessage, data: result };
      break;
  }

  return responseData; 
};
