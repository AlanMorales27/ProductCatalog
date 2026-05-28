

using Microsoft.AspNetCore.Mvc;

    [ApiController]
    [Route("api/products")]
    public class ProductController: ControllerBase
    {
        private readonly ProductService _service;

        public ProductController(ProductService service)
        {
            _service = service;
        }

        [HttpGet()]
        public async Task<ActionResult<List<Product>>> GetProducts()
        {
            var productList = await _service.GetProductsAsync();
           
            return Ok(productList);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProductById([FromRoute] int id)
        {
            var product = await _service.GetProductByIdAsync(id);

            if (product is null) return NotFound();

            return Ok(product);
        }


        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct([FromBody] Product product)
        {
            var created = await _service.CreateProductAsync(product);

            return CreatedAtAction(
                nameof(GetProductById),
                new { id = created.Id },
                created
            );
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Product>> UpdateProduct(
            [FromRoute] int id, 
            [FromBody] Product product
        )
        {
            var updated = await _service.UpdateProductAsync(id, product);

            if (updated is null) return NotFound();

            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct([FromRoute] int id)
        {
            var deleted = await _service.DeleteProductAsync(id);

            if (deleted is false) return NotFound();

            return Ok(deleted);
        }

    }

