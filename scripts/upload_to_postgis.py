#!/usr/bin/env python3
"""Upload GeoJSON features to a PostGIS table.

This script reads ``vehicles.geojson`` from the ``sharedmobility`` directory and
inserts the features into a table named ``vehicles``. Connection parameters are
read from environment variables:

- ``POSTGIS_DSN``: full DSN string, e.g. ``dbname=mydb user=me password=secret host=localhost``

The table must already exist with a ``geometry`` column of type ``GEOMETRY(Point, 4326)``.
"""

import json
import os
from pathlib import Path

import psycopg2
from psycopg2.extras import execute_values

DATASET_DIR = Path(__file__).resolve().parents[1] / "sharedmobility"
GEOJSON_PATH = DATASET_DIR / "vehicles.geojson"


def load_features():
    data = json.loads(GEOJSON_PATH.read_text())
    for feat in data.get("features", []):
        geom = feat.get("geometry")
        props = feat.get("properties", {})
        yield geom, props


def upload():
    dsn = os.environ.get("POSTGIS_DSN")
    if not dsn:
        raise RuntimeError("POSTGIS_DSN environment variable not set")

    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    rows = [(
        json.dumps(geom),
        json.dumps(props),
    ) for geom, props in load_features()]

    execute_values(
        cur,
        "INSERT INTO vehicles (geometry, properties) VALUES (ST_SetSRID(ST_GeomFromGeoJSON(%s), 4326), %s)",
        rows,
    )
    conn.commit()
    cur.close()
    conn.close()
    print(f"Uploaded {len(rows)} features to PostGIS")


if __name__ == "__main__":
    upload()
