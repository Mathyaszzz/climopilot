#!/bin/bash
# Startup script for Azure App Service

# Install dependencies
pip install -r requirements.txt

# Start the application
gunicorn --bind=0.0.0.0 --timeout 600 --workers 1 --access-logfile - --error-logfile - main:app
