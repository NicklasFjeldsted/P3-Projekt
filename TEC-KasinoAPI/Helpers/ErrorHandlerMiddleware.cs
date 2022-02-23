using System.Net;
using System.Text.Json;

namespace TEC_KasinoAPI.Helpers
{
    public class ErrorHandlerMiddleware
    {
        private readonly RequestDelegate _next;

        public ErrorHandlerMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        /// <summary>
        /// Handle any Http call with error handling.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception error)
            {
                HttpResponse response = context.Response;
                response.ContentType = "application/json";

                switch(error)
                {
                    // If something is wrong with OUR application - Code 400
                    case AppException e:
                        response.StatusCode = (int)HttpStatusCode.BadRequest;
                        break;

                    // If what was requested wasnt found - Code 404
                    case KeyNotFoundException e:
                        response.StatusCode = (int)HttpStatusCode.NotFound;
                        break;

                    // Unhandled error - Code 500
                    default:
                        response.StatusCode = (int)HttpStatusCode.InternalServerError;
                        break;
                }

                // -------- NOTE --------
                // "error?.Message" is equal to "If(error.Message != null)"
                // Thats what the "?" does
                // ----------------------

                // Serialize the error as Json
                string result = JsonSerializer.Serialize(new { message = error?.Message });
                // Write the error to the response body
                await response.WriteAsync(result);
            }
        }
    }
}
