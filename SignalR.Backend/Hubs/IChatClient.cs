using System.Threading.Tasks;

namespace SignalR.Backend.Hubs
{
	public interface IChatClient
	{
		Task ReceiveMessage(string user, string message);
	}
}
