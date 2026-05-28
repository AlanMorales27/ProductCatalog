using System.ComponentModel.DataAnnotations;

public class CreateProductDto
{
    [Required]
    public string Name { get; set; } = "";

    [Required]
    public string SKU { get; set; } = "";

    [Range(
        0, double.MaxValue,
        ErrorMessage = "El precio debe ser mayor o igual a 0"
    )]
    public decimal Price { get; set; } = 0;

    [Range(
        0, int.MaxValue,
        ErrorMessage = "El stock debe ser un número entero positivo"
    )]
    public int Stock { get; set; }

    [Required]
    public ProductCategory Category { get; set; }
}
