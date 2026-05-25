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

RUN apk add --no-cache icu-libs
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false
ENV ASPNETCORE_URLS=http://+:10000
ENV DOTNET_GCConserveMemory=9
ENV DOTNET_GCHeapHardLimit=200000000

EXPOSE 10000
COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "SkillBridge.API.dll"]
