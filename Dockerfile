FROM mcr.microsoft.com/dotnet/sdk:9.0-alpine AS build
WORKDIR /src
COPY backend/ .
RUN dotnet restore SkillBridge.API/SkillBridge.API.csproj --runtime linux-musl-x64
RUN dotnet publish SkillBridge.API/SkillBridge.API.csproj \
    -c Release \
    -r linux-musl-x64 \
    --self-contained false \
    -o /app/out

FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine AS runtime
WORKDIR /app
RUN apk add --no-cache icu-libs python3
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false
ENV ASPNETCORE_URLS=http://+:10000
ENV DOTNET_GCConserveMemory=9
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 10000
COPY --from=build /app/out .

# Copy secret config if it exists
RUN mkdir -p /etc/secrets

ENTRYPOINT ["sh", "-c", "if [ -f /etc/secrets/appsettings.Production.json ]; then cp /etc/secrets/appsettings.Production.json /app/appsettings.Production.json; fi && dotnet SkillBridge.API.dll"]
