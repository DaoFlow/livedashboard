# Scripts

This folder contains helper scripts for working with the SFOE shared mobility dataset.

## `fetch_sharedmobility.py`

Clones (or updates) the [SFOE sharedmobility](https://github.com/SFOE/sharedmobility) repository into the local `sharedmobility` directory.

Usage:

```bash
python fetch_sharedmobility.py
```

The script requires `git` and an active internet connection.

## `convert_to_geojson.py`

Parses the downloaded GBFS feeds and produces a consolidated `vehicles.geojson`
file in the `sharedmobility` directory. Run this after `fetch_sharedmobility.py`
whenever new data is available.

Usage:

```bash
python convert_to_geojson.py
```

## `upload_to_postgis.py`

Uploads the generated GeoJSON to a PostGIS database. The connection string is
read from the `POSTGIS_DSN` environment variable.

Usage:

```bash
POSTGIS_DSN="dbname=mydb user=me" python upload_to_postgis.py
```
