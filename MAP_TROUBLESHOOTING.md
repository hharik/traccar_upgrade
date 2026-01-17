# Map Troubleshooting Guide

## Issues Fixed:

### 1. Navigation Bar Fading
✅ **Fixed**: Changed z-index from `z-50` to `z-[9999]` to ensure it stays on top
✅ **Fixed**: Added `pb-[70px]` padding to map container to prevent overlap

### 2. Car Icons Not Showing
✅ **Fixed**: Updated Leaflet icon URLs to use unpkg.com CDN
✅ **Fixed**: Simplified custom marker HTML structure  
✅ **Fixed**: Added proper CSS for `.custom-marker` class
✅ **Fixed**: Added `zIndex` properties to map and sidebar elements
✅ **Fixed**: Improved marker icon with better styling (32px, proper borders)

## Testing Steps:

1. **Test Basic Map** (http://localhost:3000/map-test)
   - Should show a map of Morocco
   - Should have 1 default marker and 1 custom car marker
   - Both markers should have popups

2. **Test Full Map** (http://localhost:3000/map)
   - Should load all 48 vehicles
   - Each vehicle should have a marker (green for online, red for offline)
   - Click markers to see vehicle details
   - Navigation should stay visible at bottom

## Common Issues & Solutions:

### If map is blank:
- Check browser console for errors (F12)
- Verify Leaflet CSS is loaded
- Check if `mapContainerRef` has dimensions

### If markers don't show:
- Check console logs for "Adding marker for:" messages
- Verify positions have valid latitude/longitude
- Check if `device.positionId` matches `position.id`

### If navigation disappears:
- Check z-index hierarchy
- Verify `z-[9999]` is applied to Navigation component
- Check if map controls overlap

## Data Structure:

Devices have:
- `id`: Device ID
- `positionId`: ID of the last position
- `name`: Vehicle name
- `status`: 'online' or 'offline'

Positions have:
- `id`: Position ID  
- `deviceId`: Device ID
- `latitude`, `longitude`: GPS coordinates
- `speed`: Speed in knots (multiply by 1.852 for km/h)

## Files Modified:

1. `/src/components/Navigation.tsx` - z-index fix
2. `/src/components/MapView.tsx` - marker rendering fixes
3. `/src/app/map/page.tsx` - padding adjustment
4. `/src/app/globals.css` - Leaflet CSS and custom marker styles
5. `/src/app/map-test/page.tsx` - diagnostic page (NEW)

## Next Steps if Still Not Working:

1. Check browser developer tools Network tab
2. Verify `/api/devices` and `/api/positions` return data
3. Check console for JavaScript errors
4. Verify Leaflet version compatibility
5. Test on different browser
