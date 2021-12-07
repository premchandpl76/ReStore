using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
  [ApiController]
  [Route("[controller]")]
  public class ProductsController : ControllerBase
  {


    private readonly ILogger<WeatherForecastController> _logger;
    private readonly StoreContext _storeContext;

    public ProductsController(ILogger<WeatherForecastController> logger, StoreContext storeContext)
    {
      _storeContext = storeContext;
      _logger = logger;

    }

    [HttpGet(Name = "GetProducts")]
    public async Task<ActionResult<List<Product>>> GetProducts()
    {
      var products = await _storeContext.Products.ToListAsync();
      return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProductById(int id)
    {
      return Ok(await _storeContext.Products.FindAsync(id));
    }
  }
}


