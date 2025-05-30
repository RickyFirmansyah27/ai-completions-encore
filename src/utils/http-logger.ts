import { Logger } from './logger';

export async function httpLogger<T>(
  method: string,
  url: string,
  handler: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  Logger.http({
    message: `Request | Method: ${method} | URL: ${url}`,
  });

  try {
    const result = await handler();
    const durationInMs = performance.now() - start;
    Logger.http({
      message: `Response | Method: ${method} | URL: ${url} | Duration: ${durationInMs.toFixed(2)} ms`,
    });
    return result;
  } catch (err) {
    Logger.error(`Error occurred: ${err}`);
    throw err;
  }
}