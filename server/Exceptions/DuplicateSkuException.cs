public class DuplicateSkuException : Exception
{
    public string SKU { get; }

    public DuplicateSkuException(string sku)
        : base($"Ya existe un producto con el SKU '{sku}'")
    {
        SKU = sku;
    }
}
