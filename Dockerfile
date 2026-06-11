FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["PetrovStudio.csproj", "."]
RUN dotnet restore "./PetrovStudio.csproj"
COPY . .
WORKDIR "/src"
RUN dotnet build "PetrovStudio.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "PetrovStudio.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
USER root
COPY --from=publish /app/publish .

COPY entrypoint.sh efbundle ./

RUN chmod +x entrypoint.sh efbundle
RUN chown -R $APP_UID:$APP_UID /app
USER root

ENTRYPOINT ["./entrypoint.sh"]