# Live Dashboard

This repository contains a prototype dashboard for Swiss shared mobility data.

## Importing the SFOE Dataset

1. **Download the data**
   Run `scripts/fetch_sharedmobility.py` to clone or update the official
   [`SFOE/sharedmobility`](https://github.com/SFOE/sharedmobility) repository. The
   contents will be placed inside the `sharedmobility/` directory (ignored from
   version control).

2. **Convert to GeoJSON**
   After fetching the dataset, run `scripts/convert_to_geojson.py` to aggregate
   the GBFS feeds into `sharedmobility/vehicles.geojson`.

3. **Optional: store in PostGIS**
   If you have a PostGIS database, export the features with
   `scripts/upload_to_postgis.py` by setting the `POSTGIS_DSN` environment
   variable.

These scripts require Python 3 and `psycopg2` for PostGIS support. Install
requirements via `pip install psycopg2`.
