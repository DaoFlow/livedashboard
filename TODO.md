# Live Dashboard Development Tasks

- [ ] Understand the SFOE dataset
  - [ ] Explore the repository `https://github.com/SFOE/sharedmobility`
  - [ ] Identify available data formats (GeoJSON, CSV, etc.)
  - [ ] Map dataset fields to dashboard needs
  - [ ] Check update frequency and access method

- [ ] Import the SFOE data
  - [x] Script automated download of latest dataset
  - [ ] Convert data to GeoJSON or common format
  - [ ] (Optional) Store data in PostGIS or similar DB

- [ ] Provide a REST/GeoJSON endpoint
  - [ ] Serve `/api/vehicles` returning current data
  - [ ] Consider caching to minimize network usage

- [ ] Update the frontend
  - [ ] Replace `generateMockVehicles()` with API call
  - [ ] Adjust markers and statistics to real fields

- [ ] Deployment considerations
  - [ ] Host backend and dashboard
  - [ ] Schedule periodic data updates (cron)

- [ ] Additional improvements
  - [ ] Predictive analytics
  - [ ] WhatsApp bot / AR view
  - [ ] Battery data or other provider APIs
