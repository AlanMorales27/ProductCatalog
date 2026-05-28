export const API_BASE = "http://localhost:5230";

export class ApiError extends Error {
    constructor(public status: number, message?: string, public title?: string) {
        super(message ?? `HTTP ${status}`);
        this.name = "ApiError";
    }
}

type ProblemDetails = {
    status?: number;
    title?: string;
    detail?: string;
};

export async function throwApiError(res: Response): Promise<never> {
    let body: ProblemDetails | null = null;
    try {
        const text = await res.text();
        body = text ? (JSON.parse(text) as ProblemDetails) : null;
    } catch {
        body = null;
    }
    throw new ApiError(res.status, body?.detail ?? body?.title, body?.title);
}
