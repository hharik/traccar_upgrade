# How to Get Fixed Radar Data for Morocco

## Option 1: OpenStreetMap (Recommended - Free & Legal)

### Using Overpass API to get speed cameras:

```bash
# Query all speed cameras in Morocco
curl -X POST \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "data=[out:json];area[name=\"Morocco\"]->.a;(node[\"highway\"=\"speed_camera\"](area.a););out;" \
  https://overpass-api.de/api/interpreter
```

### Or use this web interface:
1. Go to: https://overpass-turbo.eu/
2. Paste this query:
```
[out:json];
area[name="Morocco"]->.a;
(
  node["highway"="speed_camera"](area.a);
  way["highway"="speed_camera"](area.a);
);
out body;
>;
out skel qt;
```
3. Click "Run" and then "Export" → "GeoJSON"

### Using Overpass API in your app:
```javascript
// Example API call to get speed cameras in Morocco
const query = `
[out:json];
area[name="Morocco"]->.a;
node["highway"="speed_camera"](area.a);
out;
`;

const response = await fetch('https://overpass-api.de/api/interpreter', {
  method: 'POST',
  body: 'data=' + encodeURIComponent(query)
});

const data = await response.json();
// data.elements contains array of speed cameras with lat/lon
```

## Option 2: Community Datasets

### Scdb.info (Speed Camera Database)
- Website: https://scdb.info/
- Has crowdsourced speed camera data
- May have Morocco data
- Check their terms for API access

### POI Factory
- Website: https://www.poi-factory.com/
- Community-maintained POI (Points of Interest) including speed cameras
- Download as CSV/GPX files

## Option 3: Create Your Own Database

Since official data might be limited, you could:

1. **Start with manual entry** - Add known camera locations
2. **Crowdsource from your drivers** - Let them report cameras
3. **Analyze vehicle data** - Detect where vehicles frequently slow down
4. **Combine multiple sources** - OSM + manual entries + driver reports

## Example: Import from CSV

Create a file `radars_morocco.csv`:
```csv
name,latitude,longitude,speed_limit,direction,type
Rabat-Casablanca Highway,33.5731,-7.5898,120,both,fixed
Marrakech Ring Road,31.6295,-7.9811,80,north,fixed
Tangier-Tetouan Road,35.7595,-5.8340,100,both,fixed
```

Then import it into your database.

## Legal & Ethical Notes

⚠️ **Important:**
- Don't scrape Waze or Google Maps (violates ToS)
- Use only open/public data sources
- Credit data sources appropriately
- Keep data updated (cameras can be moved/removed)
- In some countries, radar warning systems are illegal while driving

## For Your App

I can help you implement:
1. Manual radar entry system (admin panel)
2. Import from CSV/GeoJSON
3. Display radars on map
4. Alert drivers when approaching
5. Database schema for storing radar data

Let me know which approach you'd like to take!
