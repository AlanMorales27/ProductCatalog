using Microsoft.EntityFrameworkCore;

public class AppDbContext: DbContext
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
        });
    }
}