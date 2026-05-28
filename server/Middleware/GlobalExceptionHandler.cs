using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken
    )
    {
        var (status, title, detail) = Map(exception);

        if (status == StatusCodes.Status500InternalServerError)
        {
            _logger.LogError(exception, "Unhandled exception while processing {Path}", httpContext.Request.Path);
        }

        var problem = new ProblemDetails
        {
            Status = status,
            Title = title,
            Detail = detail,
            Instance = httpContext.Request.Path,
        };

        httpContext.Response.StatusCode = status;
        await httpContext.Response.WriteAsJsonAsync(problem, cancellationToken);
        return true;
    }

    private static (int status, string title, string detail) Map(Exception ex) => ex switch
    {
        DuplicateSkuException dup => (
            StatusCodes.Status409Conflict,
            "SKU duplicado",
            dup.Message
        ),
        KeyNotFoundException => (
            StatusCodes.Status404NotFound,
            "Recurso no encontrado",
            ex.Message
        ),
        ArgumentException => (
            StatusCodes.Status400BadRequest,
            "Solicitud inválida",
            ex.Message
        ),
        _ => (
            StatusCodes.Status500InternalServerError,
            "Error interno del servidor",
            "Ocurrió un error inesperado. Inténtalo de nuevo."
        ),
    };
}
