export function ErrorHandler(err: Error) {
  return {
    statusCode: 500,
    status: false,
    error: err.message,
  };
}