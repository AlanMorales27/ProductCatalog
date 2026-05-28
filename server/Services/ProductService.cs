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

    public async Task<Product> CreateProductAsync(CreateProductDto dto)
    {
        var skuExists = await _context.Products.AnyAsync(p => p.SKU == dto.SKU);

        if (skuExists)
        {
            throw new DuplicateSkuException(dto.SKU);
        }

        var product = new Product
        {
            Name = dto.Name,
            SKU = dto.SKU,
            Price = dto.Price,
            Stock = dto.Stock,
            Category = dto.Category,
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return product;
    }

    public async Task<Product?> UpdateProductAsync(int id, UpdateProductDto dto)
    {
        var existingProduct = await _context.Products.FindAsync(id);
        if (existingProduct is null) return null;

        var skuTaken = await _context.Products.AnyAsync(p => p.SKU == dto.SKU && p.Id != id);

        if (skuTaken)
        { 
            throw new DuplicateSkuException(dto.SKU); 
        };
        
        existingProduct.Name = dto.Name;
        existingProduct.Price = dto.Price;
        existingProduct.Stock = dto.Stock;
        existingProduct.SKU = dto.SKU;
        existingProduct.Category = dto.Category;

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
