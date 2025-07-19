# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mill Cove Mood is a single-page weather application that displays weather conditions and tide data for Weymouth, MA (Mill Cove area). The app identifies "MOOD" days - perfect beach days defined as having high tides between noon-8pm, temperature 60°F+, and no rain.

## Architecture

- **Frontend**: Single HTML file (`index.html`) with embedded CSS and JavaScript
- **Data Source**: Automated GitHub Actions workflow fetches real weather/tide data
- **APIs**: OpenWeatherMap for weather, NOAA for tide data
- **Deployment**: Static site (can be hosted on GitHub Pages)

## Key Files

- `index.html` - Complete application (HTML/CSS/JavaScript)
- `.github/workflows/tide-and-weather.yml` - Data fetching automation
- `data/weather-data.json` - Generated weather/tide data (created by workflow)

## Development Workflow

### Local Development
- Open `index.html` directly in browser (no build process required)
- Application falls back to fake data if `data/weather-data.json` doesn't exist

### GitHub Actions Workflow
- Runs daily at midnight UTC with hourly retries if failed
- Manual trigger available via GitHub Actions UI
- Requires `OPENWEATHER_API_KEY` secret in repository settings
- Creates/updates `data/weather-data.json` with current weather and tide data

### Testing the Workflow
```bash
# Trigger manually via GitHub CLI
gh workflow run "Fetch Weather & Tide Data"
```

## MOOD Day Logic

A day qualifies as a "MOOD" day when ALL conditions are met:
- High tide occurs between 12pm-8pm
- Temperature ≥ 60°F
- Rain chance < 30%

## Configuration

### Weather API Setup
- OpenWeatherMap API key required in GitHub repository secrets
- Location: Latitude 42.2181, Longitude -70.9395 (Mill Cove area)

### Tide Data
- NOAA Station ID: 8443970 (Boston Harbor)
- Automatically converts to local time (EST/EDT)

## Data Structure

The workflow generates `data/weather-data.json` with this structure:
```json
{
  "lastUpdated": "ISO timestamp",
  "location": "Weymouth, MA (Mill Cove)",
  "source": "OpenWeatherMap & NOAA",
  "data": [
    {
      "date": "Today",
      "temp": 72,
      "tempLow": 58,
      "condition": "☀️",
      "description": "Clear",
      "humidity": 45,
      "wind": "8 mph",
      "rainChance": 0,
      "tides": {
        "high": ["6:32 AM", "7:15 PM"],
        "low": ["12:45 PM", "1:22 AM"]
      },
      "isMoodDay": true
    }
  ]
}
```