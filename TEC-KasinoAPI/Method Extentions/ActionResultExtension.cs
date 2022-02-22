namespace TEC_KasinoAPI.Controllers
{
    public static class ActionResultExtension
    {
        private static CookieOptions cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTimeOffset.UtcNow.AddDays(7),
            SameSite = SameSiteMode.None,
            Secure = true
        };

        public static ActionResult RefreshToken(this ActionResult result, HttpResponse response, string refreshToken)
        {
            response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
            return result;
        }
    }
}
