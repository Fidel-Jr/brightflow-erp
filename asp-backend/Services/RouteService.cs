using System.Text;
using System.Text.Json;

namespace asp_backend.Services
{
    public class RouteService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public RouteService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _config = config;
        }

        // Geocode typed address
        public async Task<(double lat, double lng)> Geocode(string address)
        {
            var apiKey = _config["OpenRouteService:ApiKey"];
            var url = $"https://api.openrouteservice.org/geocode/search?api_key={apiKey}&text={Uri.EscapeDataString(address)}";

            var response = await _httpClient.GetStringAsync(url);
            using var json = JsonDocument.Parse(response);

            var features = json.RootElement.GetProperty("features");
            if (features.GetArrayLength() == 0)
                throw new Exception($"No geocoding results for address: {address}");

            var coords = features[0].GetProperty("geometry").GetProperty("coordinates");
            return (coords[1].GetDouble(), coords[0].GetDouble());
        }

        // Get route distance and duration
        public async Task<(double distanceKm, double durationMin)> GetRoute(double originLat, double originLng, double destLat, double destLng)
        {
            var apiKey = _config["OpenRouteService:ApiKey"];
            var body = new
            {
                coordinates = new[]
                {
                    new[] { originLng, originLat },
                    new[] { destLng, destLat }
                }
            };

            var request = new HttpRequestMessage(HttpMethod.Post, "https://api.openrouteservice.org/v2/directions/driving-car");
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", apiKey);
            request.Content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(request);
            var jsonString = await response.Content.ReadAsStringAsync();
            using var json = JsonDocument.Parse(jsonString);

            var summary = json.RootElement.GetProperty("routes")[0].GetProperty("summary");
            double distanceKm = summary.GetProperty("distance").GetDouble() / 1000;
            double durationMin = summary.GetProperty("duration").GetDouble() / 60;

            return (distanceKm, durationMin);
        }

        // Reverse geocode map click to address
        public async Task<string> ReverseGeocode(double lat, double lng)
        {
            var apiKey = _config["OpenRouteService:ApiKey"];
            var url = $"https://api.openrouteservice.org/geocode/reverse?api_key={apiKey}&point.lat={lat}&point.lon={lng}";

            var response = await _httpClient.GetStringAsync(url);
            using var json = JsonDocument.Parse(response);

            var features = json.RootElement.GetProperty("features");
            if (features.GetArrayLength() == 0) return "";

            var props = features[0].GetProperty("properties");
            return props.GetProperty("label").GetString() ?? "";
        }
    }
}
