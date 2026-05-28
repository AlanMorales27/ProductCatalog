using Microsoft.EntityFrameworkCore;


public class ProductService
{
    private readonly AppDbContext _context;

    public ProductService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Product>> GetProductsAsync()
    {
        return await _context.Products.ToListAsync();
    }

    public async Task<Product?> GetProductByIdAsync(int id)
    {
        return await _context.Products.FindAsync(id);
    }

    public async Task<Product> CreateProductAsync(Product product)
    {
        var skuExists = await _context.Products.AnyAsync(p => p.SKU == product.SKU);

        if (skuExists)
        {
            throw new DuplicateSkuException(product.SKU);
        }

        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return product;
    }

    public async Task<Product?> UpdateProductAsync(int id, Product product)
    {
        var existingProduct = await _context.Products.FindAsync(id);
        if (existingProduct is null) return null;

        existingProduct.Name = product.Name;
        existingProduct.Price = product.Price;
        existingProduct.Stock = product.Stock;
        existingProduct.SKU = product.SKU;
        existingProduct.Category = product.Category;

        await _context.SaveChangesAsync();
        return existingProduct;
    }

    public async Task<bool> DeleteProductAsync(int id)
    {
        var existingProduct = await _context.Products.FindAsync(id);
        if (existingProduct is null) return false;

        _context.Products.Remove(existingProduct);
        await _context.SaveChangesAsync();
        return true;
    }
}
