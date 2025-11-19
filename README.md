# Ndlela Search Engine - Scaffold

This workspace contains scaffolded starter projects for the South African national tourism platform.

What was created:
- `backend/services/SA.Tourism.Business.*` — sample .NET 8 microservice (API, Services, Models, Tests)
- `frontend/server` — Node + Express skeleton with route placeholders

Next steps:
1. From PowerShell, restore and build the .NET projects with `dotnet restore` and `dotnet build` in the `backend` folder.
2. Run tests for the example service: `dotnet test` under the `backend/services/SA.Tourism.Business.Tests` folder.
3. In `frontend/server`, run `npm install` then `npm run dev` to start the Express server.
4. Scaffold the React client with `npx create-react-app client --template typescript` inside `frontend` or provide your own React app in `frontend/client`.

This is a starting point. Use the naming conventions described in project documentation to add new services.
