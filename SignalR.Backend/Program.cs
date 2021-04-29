using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Server.HttpSys;
using Microsoft.Extensions.Hosting;

namespace SignalR.Backend
{
	public class Program
	{
		public static void Main(string[] args)
		{
			CreateHostBuilder(args).Build().Run();
		}

		public static IHostBuilder CreateHostBuilder(string[] args)
		{
			return Host.CreateDefaultBuilder(args)
				.ConfigureWebHostDefaults(webBuilder =>
				{
					webBuilder.UseStartup<Startup>()
						.UseHttpSys(options =>
						{
							options.Authentication.Schemes =
								AuthenticationSchemes.NTLM |
								AuthenticationSchemes.Negotiate;
							options.Authentication.AutomaticAuthentication = true;
							options.Authentication.AllowAnonymous = true;
						});
				})
				.UseWindowsService();
		}
	}
}
