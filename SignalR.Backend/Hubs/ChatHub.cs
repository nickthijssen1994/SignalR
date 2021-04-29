using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace SignalR.Backend.Hubs
{

	[Authorize]
	public class ChatHub : Hub<IChatClient>
	{
		private readonly ILogger<ChatHub> _logger;

		public ChatHub(ILogger<ChatHub> logger)
		{
			_logger = logger;
		}

		[Authorize]
		public Task SendMessage(string user, string message)
		{
			_logger.LogInformation("Message Received: [User]:[" + user + "] [Message]:[" + message + "]");
			return Clients.All.ReceiveMessage(user, message);
		}

		[Authorize]
		public Task SendMessageToCaller(string user, string message)
		{
			_logger.LogInformation("Message Received: [User]:[" + user + "] [Message]:[" + message + "]");
			return Clients.Caller.ReceiveMessage(user, message);
		}

		[Authorize]
		public Task SendMessageToGroup(string user, string message)
		{
			_logger.LogInformation("Message Received: [User]:[" + user + "] [Message]:[" + message + "]");
			return Clients.Group("SignalR Users").ReceiveMessage(user, message);
		}

		public override async Task OnConnectedAsync()
		{
			_logger.LogInformation("Client Connected");
			_logger.LogInformation(Context.User.Identity.Name);
			await Groups.AddToGroupAsync(Context.ConnectionId, "SignalR Users");
			await base.OnConnectedAsync();
		}

		public override async Task OnDisconnectedAsync(Exception exception)
		{
			_logger.LogInformation("Client Disconnected");
			await Groups.RemoveFromGroupAsync(Context.ConnectionId, "SignalR Users");
			await base.OnDisconnectedAsync(exception);
		}
	}
}
