using Microsoft.EntityFrameworkCore.ChangeTracking;
namespace TEC_KasinoAPI.Helpers
{
    public static class DbContextExtensionMethods
    {
        public static async Task<EntityEntry<T>> UpdateAsync<T>(this DbContext dbContext, T entityToUpdate) where T : class
        {
            return await Task.Run(() => dbContext.Update(entityToUpdate));
        }
    }
    public static class IEnumerableExtensionMethods
    {
        public static async Task<bool> AnyAsync<T>(this IEnumerable<T> entities, Func<T, bool> predicate) where T : class
        {
            return await Task.Run(() => entities.Any(predicate));
        }

        public static async Task<T> SingleOrDefaultAsync<T>(this IEnumerable<T> entities, Func<T, bool> predicate) where T : class
        {
            return await Task.Run(() => entities.SingleOrDefault(predicate));
        }

        public static async Task<T> SingleAsync<T>(this IEnumerable<T> entities, Func<T, bool> predicate) where T : class
        {
            return await Task.Run(() => entities.Single(predicate));
        }
    }
    public static class DbSetExtensionMethods
    {
        public static async Task<EntityEntry<T>> RemoveAsync<T>(this DbSet<T> context, T itemToRemove) where T : class
        {
            return await Task.Run(() => context.Remove(itemToRemove));
        }

        public static async Task<EntityEntry<T>> UpdateAsync<T>(this DbSet<T> context, T entityToUpdate) where T : class
        {
            return await Task.Run(() => context.Update(entityToUpdate));
        }
    }
}
