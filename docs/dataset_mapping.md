# Dataset Field Mapping

This document links fields from the SFOE **sharedmobility** dataset to the features used in the demo dashboard under `visualization/modern-dashboard`.

## Source

The dataset is provided via the GBFS 2.3 API at [sharedmobility.ch/v2](https://sharedmobility.ch/v2/). For details about field additions see `sharedmobility/Additions to GBFS.md` in this repository.

## Important Fields

| Dataset Field | Purpose in Dashboard |
|---------------|---------------------|
| `provider_id` | Used to identify the mobility provider. Allows filtering by provider and is included in combined IDs (`station_id`, `bike_id`). |
| `vehicle_type` | Determines the type of asset (Bike, E-Bike, Scooter, etc.). Controls marker style and statistics per vehicle category. |
| `pickup_type` | Indicates whether vehicles are free-floating or station‑based. Drives display logic for markers. |
| `station_id` | Unique ID for a station. Combined with `provider_id` in GBFS 2.0. Used to place station markers. |
| `bike_id` | Unique ID for a single vehicle in `free_bike_status.json`. Required when showing individual bike positions. |
| `lat` / `lon` | Geographic coordinates. Used to position markers on the map. |
| `is_reserved` / `is_disabled` | Availability flags for free vehicles. Used to show only available assets. |
| `num_bikes_available` / `num_docks_available` | Availability information for stations. Used in statistics widgets. |
| `region_id` / `region_name` | Allows grouping stations/vehicles by region. Can be used for regional filters. |
| `name`, `address`, `post_code` | Station details shown in popups or tooltips. |

These fields cover the minimum needed to replace the current `generateMockVehicles()` data generator with real values.

## Next Steps

1. Use the REST API or GBFS endpoints to fetch the above fields.
2. Convert the data to a common GeoJSON format or keep the GBFS structure.
3. Update the frontend to read these fields instead of mock data.

