using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SA.Tourism.Search.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure HttpClient for Business API
var businessApiUrl = builder.Configuration["BusinessApi:Url"] ?? Environment.GetEnvironmentVariable("BUSINESS_API_URL") ?? "http://localhost:5002";
builder.Services.AddHttpClient("BusinessApi", client =>
{
    client.BaseAddress = new System.Uri(businessApiUrl);
});

builder.Services.AddSingleton<ISearchService>(sp =>
{
    var httpClientFactory = sp.GetRequiredService<IHttpClientFactory>();
    return new SearchService(httpClientFactory);
});

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();
