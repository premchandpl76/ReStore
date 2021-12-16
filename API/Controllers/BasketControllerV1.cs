

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using API.Data;
using API.Data.Migrations;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
namespace API.Controllers
{
    public class BasketV1Controller:BaseApiController
    {
        private readonly StoreContext _storeContext;
    public BasketV1Controller(StoreContext storeContext)
    {
      _storeContext = storeContext;
    }

    [HttpGet(Name ="GetBasket")]
    public async Task <ActionResult<BasketDto>> GetBasket()
    {
      var basket = await RetrieveBasket();
      if (basket == null)
      {
        return NotFound();
      }
      return MapBasketToDto(basket);
    } 


    [HttpPost]
    public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
    {
      //get basket
      var basket = await RetrieveBasket();
      if(basket==null)  basket = CreateBasket();
      var product = await _storeContext.Products.FindAsync(productId);
      if(product==null) return NotFound();
      basket.AddItem(product,quantity);
      var result = await _storeContext.SaveChangesAsync()>0;
      if(result) {
        return CreatedAtRoute("GetBasket", MapBasketToDto(basket));
      }
      return BadRequest(new ProblemDetails{Title="Problem saving items to basket"});
    }

    

    [HttpDelete]
    public async Task<ActionResult> RemoveItemToBasket(int productId, int quantity)
    {     
      //get basket
      var basket = await RetrieveBasket();
      if(basket==null) return NotFound();
      //remove item  or reduce quantity
      basket.RemoveItem(productId, quantity);      
      var result = await _storeContext.SaveChangesAsync()>0;
      if(result) {
        return Ok();
      }
      return BadRequest(new ProblemDetails{Title="Problem removing items from basket"});
    }


    private async Task<Basket> RetrieveBasket()
    {
      return await _storeContext.Baskets
            .Include(i => i.Items)
            .ThenInclude(p => p.Product)
            .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
    }
    private Basket CreateBasket()
    {
      var buyerId = Guid.NewGuid().ToString();
      var cookieOptions = new CookieOptions{IsEssential=true, Expires=DateTime.Now.AddDays(30)};
      
      Response.Cookies.Append("buyerId", buyerId, cookieOptions);

      var basket = new Basket
      {
        BuyerId = buyerId
      };
      _storeContext.Baskets.Add(basket);
      return basket;
    }

    private BasketDto MapBasketToDto(Basket basket)
    {
      return new BasketDto
      {
        Id = basket.Id,
        BuyerId = basket.BuyerId,
        Items = basket.Items.Select(item => new BasketItemDto
        {
          ProductId = item.ProductId,
          Brand = item.Product.Brand,
          Type = item.Product.Type,
          PictureUrl = item.Product.PictureUrl,
          Name = item.Product.Name,
          Price = item.Product.Price,
          Quantity = item.Quantity
        }).ToList()
      };
    }
}


}