#!/bin/sh
set -e

echo "Applying database migrations..."
./efbundle --connection "$ConnectionStrings__DefaultConnection"

echo "Database migrations applied successfully! Starting API..."
exec dotnet PetrovStudio.dll
