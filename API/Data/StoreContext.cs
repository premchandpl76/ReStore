using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
  public class StoreContext : DbContext
  {
    public DbSet<Product> Products { get; set; }
    public DbSet<Basket> Baskets { get; set; }
    public StoreContext(DbContextOptions options) : base(options)
    {
    }
  }
}