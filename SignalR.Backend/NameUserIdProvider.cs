using Microsoft.AspNetCore.SignalR;

namespace SignalR.Backend
{
	public class NameUserIdProvider : IUserIdProvider
	{
		public string GetUserId(HubConnectionContext connection)
		{
			return connection.User?.Identity?.Name;
		}
	}
}
