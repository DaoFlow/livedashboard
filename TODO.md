# Live Dashboard Development Tasks

- [ ] Understand the SFOE dataset
  - [x] Explore the repository `https://github.com/SFOE/sharedmobility`
  - [x] Identify available data formats (GBFS JSON API, providers CSV)
  - [x] Map dataset fields to dashboard needs
    - `provider_id`, `pickup_type`, `vehicle_type`, `station_id`, `bike_id`,
      coordinates, availability flags, region and station details
  - [x] Check update frequency and access method
    - GBFS 2.3/2.0 and REST endpoints require `Authorization` header with an email
    - Provider list in `providers.csv` includes update cycle per provider
    - Example feeds show `ttl` of 60 seconds
    - Terms of use: Open data with attribution

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
