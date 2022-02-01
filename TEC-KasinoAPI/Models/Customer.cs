using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace TEC_KasinoAPI.Models
{
	public class Customer
	{
		[Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int CustomerID { get; set; } 

		[Required(ErrorMessage = "Field cannot be empty"), DataType(DataType.EmailAddress)]
		public string Email { get; set; }

		[Required (ErrorMessage = "Field cannot be empty"), DataType(DataType.Password), MinLength(8, ErrorMessage = "Password must be atleast 8 digits long")]
		public string Password { get; set; }
		
		[Required(ErrorMessage = "Field cannot be empty")]
		public Country Country { get; set; } 

		[Required(ErrorMessage = "Phone number must be 8 digits"), DataType(DataType.PhoneNumber), StringLength(8, MinimumLength = 8)]
		public int PhoneNumber { get; set; }

		[Required(ErrorMessage = "Personal number must be 10 digits"), StringLength(10, MinimumLength = 10)]
		public int CPRNumber { get; set; }

		[Required(ErrorMessage = "Field cannot be empty")]
		public string FirstName { get; set; }

		[Required(ErrorMessage = "Field cannot be empty")]
		public string LastName { get; set; }

		[Required(ErrorMessage = "Field cannot be empty")]
		public string Address { get; set; }

		[Required(ErrorMessage = "Field cannot be empty"), DataType(DataType.PostalCode)]
		public int PostCode { get; set; }

		[Required(ErrorMessage = "Field cannot be empty")]
		public string City	{ get; set; } 

		[Required]
		public AccountGender Gender { get; set; }

		public AccountBalance Acc_balance { get; set; }

		public DateTime RegisterDate { get; set; }
	}

}
