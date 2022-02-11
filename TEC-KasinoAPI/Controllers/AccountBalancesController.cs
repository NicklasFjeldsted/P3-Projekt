using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TEC_KasinoAPI.Data;
using TEC_KasinoAPI.Models;

namespace TEC_KasinoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountBalancesController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public AccountBalancesController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/AccountBalances
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AccountBalance>>> GetAccountBalances()
        {
            return await _context.AccountBalances.ToListAsync();
        }

        // GET: api/AccountBalances/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AccountBalance>> GetAccountBalance(int id)
        {
            var accountBalance = await _context.AccountBalances.FindAsync(id);

            if (accountBalance == null)
            {
                return NotFound();
            }

            return accountBalance;
        }

        // PUT: api/AccountBalances/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAccountBalance(int id, AccountBalance accountBalance)
        {
            if (id != accountBalance.BalanceID)
            {
                return BadRequest();
            }

            _context.Entry(accountBalance).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AccountBalanceExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/AccountBalances
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AccountBalance>> PostAccountBalance(AccountBalance accountBalance)
        {
            _context.AccountBalances.Add(accountBalance);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAccountBalance", new { id = accountBalance.BalanceID }, accountBalance);
        }

        // DELETE: api/AccountBalances/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAccountBalance(int id)
        {
            var accountBalance = await _context.AccountBalances.FindAsync(id);
            if (accountBalance == null)
            {
                return NotFound();
            }

            _context.AccountBalances.Remove(accountBalance);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AccountBalanceExists(int id)
        {
            return _context.AccountBalances.Any(e => e.BalanceID == id);
        }
    }
}
