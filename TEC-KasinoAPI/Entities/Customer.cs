using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using TEC_KasinoAPI.Entities;

namespace TEC_KasinoAPI.Models
{
	public class Customer
	{
		[Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int CustomerID { get; set; } 

		[Required(ErrorMessage = "Field cannot be empty"), DataType(DataType.EmailAddress)]
		public string Email { get; set; }

		[JsonIgnore]
		[Required (ErrorMessage = "Field cannot be empty"), DataType(DataType.Password), MinLength(8, ErrorMessage = "Password must be atleast 8 digits long")]
		public string Password { get; set; }
		
		[Required(ErrorMessage = "Field cannot be empty")]
		public virtual Country Country { get; set; } 

		[Required(ErrorMessage = "Phone number must be 8 digits"), DataType(DataType.PhoneNumber), StringLength(8, MinimumLength = 8)]
		public int PhoneNumber { get; set; }

		[Required(ErrorMessage = "Personal number must be 10 digits"), StringLength(11, MinimumLength = 10), ]
		public string CPRNumber { get; set; }

		[Required(ErrorMessage = "Field cannot be empty")]
		public string FirstName { get; set; }

		[Required(ErrorMessage = "Field cannot be empty")]
		public string LastName { get; set; }

		[Required(ErrorMessage = "Field cannot be empty")]
		public string Address { get; set; }

		[Required(ErrorMessage = "Field cannot be empty")]
		public virtual ZipCode ZipCode { get; set; }

		public string Role { get; set; }

		[JsonIgnore]
		public List<RefreshToken> RefreshTokens { get; set; }

		[Required]
		public virtual AccountGender Gender { get; set; }

		public virtual AccountBalance Acc_balance { get; set; }

		public DateTime RegisterDate { get; set; }

		public Customer(RegisterRequest request)
        {
			
        }
	}

}
