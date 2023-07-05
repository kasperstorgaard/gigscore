export class APIError extends Error {
  constructor(public status: number, public statusText: string) {
    super(`${status}: ${statusText}`);
  }
}
