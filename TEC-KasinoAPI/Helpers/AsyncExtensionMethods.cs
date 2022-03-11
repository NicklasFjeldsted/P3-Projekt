using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace TEC_KasinoAPI.Helpers
{
    /// <summary>
    /// Encapsulate the DbContext asynchronous extension methods.
    /// </summary>
    public static class DbContextExtensionMethods
    {
        /// <summary>
        /// Asynchronously update the <typeparamref name="T"/> object.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="dbContext"></param>
        /// <param name="entityToUpdate"></param>
        /// <returns></returns>
        public static async Task<EntityEntry<T>> UpdateAsync<T>(this DbContext dbContext, T entityToUpdate) where T : class
        {
            return await Task.Run(() => dbContext.Update(entityToUpdate));
        }
    }

    /// <summary>
    /// Encapsulate the IEnumerable asynchronous extension methods.
    /// </summary>
    public static class IEnumerableExtensionMethods
    {
        /// <summary>
        /// Asynchronously determine whether any element of a sequence satisfies a condition.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="entities"></param>
        /// <param name="predicate"></param>
        /// <returns></returns>
        public static async Task<bool> AnyAsync<T>(this IEnumerable<T> entities, Func<T, bool> predicate) where T : class
        {
            return await Task.Run(() => entities.Any(predicate));
        }

        /// <summary>
        /// Asynchronously returns the only element of a sequence, or a default value if the sequence is empty.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="entities"></param>
        /// <param name="predicate"></param>
        /// <returns></returns>
        public static async Task<T> SingleOrDefaultAsync<T>(this IEnumerable<T> entities, Func<T, bool> predicate) where T : class
        {
            return await Task.Run(() => entities.SingleOrDefault(predicate));
        }

        /// <summary>
        /// Asynchronously returns the only element of a sequence.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="entities"></param>
        /// <param name="predicate"></param>
        /// <returns></returns>
        public static async Task<T> SingleAsync<T>(this IEnumerable<T> entities, Func<T, bool> predicate) where T : class
        {
            return await Task.Run(() => entities.Single(predicate));
        }
    }

    /// <summary>
    /// Encapsulate the DbSet asynchronous extension methods.
    /// </summary>
    public static class DbSetExtensionMethods
    {
        /// <summary>
        /// Asynchronously removes an element from the <see cref="DbSet{TEntity}"/>.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="context"></param>
        /// <param name="itemToRemove"></param>
        /// <returns></returns>
        public static async Task<EntityEntry<T>> RemoveAsync<T>(this DbSet<T> context, T itemToRemove) where T : class
        {
            return await Task.Run(() => context.Remove(itemToRemove));
        }

        /// <summary>
        /// Asynchronously update a <see cref="DbSet{TEntity}"/> with <typeparamref name="T"/> <paramref name="entityToUpdate"/>.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="context"></param>
        /// <param name="entityToUpdate"></param>
        /// <returns></returns>
        public static async Task<EntityEntry<T>> UpdateAsync<T>(this DbSet<T> context, T entityToUpdate) where T : class
        {
            return await Task.Run(() => context.Update(entityToUpdate));
        }
    }

    /// <summary>
    /// Encapsulate the JwtToken asynchronous extension methods.
    /// </summary>
    public static class JwtTokenExtensionMethods
    {
        /// <summary>
        /// Asynchronously create a new security token from a security token description.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="descriptor"></param>
        /// <returns></returns>
        public static async Task<SecurityToken> CreateTokenAsync(this JwtSecurityTokenHandler context, SecurityTokenDescriptor descriptor)
        {
            return await Task.Run(() => context.CreateToken(descriptor));
        }

        /// <summary>
        /// Asynchronously <inheritdoc cref="JwtSecurityTokenHandler.WriteToken(SecurityToken)"/>
        /// </summary>
        /// <param name="context"></param>
        /// <param name="token"></param>
        /// <returns></returns>
        public static async Task<string> WriteTokenAsync(this JwtSecurityTokenHandler context, SecurityToken token)
        {
            return await Task.Run(() => context.WriteToken(token));
        }
    }

    /// <summary>
    /// Encapsulate the RandomNumberGenerator asynchronous extension methods.
    /// </summary>
    public static class RandomNumberGeneratorExtensionMethods
    {
        /// <summary>
        /// Asynchronously <inheritdoc cref="RandomNumberGenerator.GetBytes(byte[])"/>
        /// </summary>
        /// <param name="context"></param>
        /// <param name="data"></param>
        /// <returns></returns>
        public static async Task GetBytesAsync(this RandomNumberGenerator context, byte[] data)
        {
            await Task.Run(() => context.GetBytes(data));
        }
    }

    /// <summary>
    /// Encapsulate the ClaimsPrinciple asynchronous extension methods.
    /// </summary>
    public static class ClaimsPrincipleExtensionMethods
    {
        public static async Task<string> FindFirstAsync(this ClaimsPrincipal context, string type)
        {
            return await Task.Run(() => context.FindFirst(type).Value);
        }
    }
}
