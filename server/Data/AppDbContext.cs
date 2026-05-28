using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public DbSet<Product> Products { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder options) =>
        options
            .UseSqlServer("Server=MSI\\SQLEXPRESS;Database=ProductDb;Trusted_Connection=True;TrustServerCertificate=True;")
            .LogTo(Console.WriteLine, LogLevel.Information);

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>(entity =>
        {
            entity.Property(p => p.Price).HasPrecision(18, 2);
            entity.HasIndex(p => p.SKU).IsUnique();
            entity.HasData(
                new Product { Id = 1, Name = "Camiseta Básica", SKU = "CAMBAS001", Price = 29900m, Stock = 50, Category = ProductCategory.Camisetas },
                new Product { Id = 2, Name = "Jean Slim", SKU = "JEASLM002", Price = 89900m, Stock = 30, Category = ProductCategory.Pantalones },
                new Product { Id = 3, Name = "Vestido Floral", SKU = "VESFLO003", Price = 65900m, Stock = 20, Category = ProductCategory.Vestidos},
                new Product { Id = 4, Name = "Chaqueta Denim", SKU = "CHADEN004", Price = 120000m, Stock = 15, Category = ProductCategory.Chaquetas },
                new Product { Id = 5, Name = "Blusa Manga Larga", SKU = "BLUMAN005", Price = 45900m, Stock = 40, Category = ProductCategory.Blusas }
            );
        });
    }
}