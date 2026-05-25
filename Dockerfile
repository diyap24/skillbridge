FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY backend/ .
RUN dotnet restore SkillBridge.API/SkillBridge.API.csproj
RUN dotnet publish SkillBridge.API/SkillBridge.API.csproj \
    -c Release \
    -o /app/out

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends python3 && rm -rf /var/lib/apt/lists/*
ENV ASPNETCORE_URLS=http://+:10000
ENV DOTNET_GCConserveMemory=9
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 10000
COPY --from=build /app/out .

RUN mkdir -p /etc/secrets

ENTRYPOINT ["sh", "-c", "if [ -f /etc/secrets/appsettings.Production.json ]; then cp /etc/secrets/appsettings.Production.json /app/appsettings.Production.json; fi && dotnet SkillBridge.API.dll"]
