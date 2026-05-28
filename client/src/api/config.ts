export const API_BASE = "http://localhost:5230";

export class ApiError extends Error {
    constructor(public status: number) {
        super(`HTTP ${status}`);
        this.name = "ApiError";
    }
}
