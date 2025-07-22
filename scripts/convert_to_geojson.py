#!/usr/bin/env python3
"""Convert SFOE shared mobility dataset to GeoJSON.

This script expects the dataset cloned via ``fetch_sharedmobility.py``
under the ``sharedmobility`` directory. It parses available GBFS JSON
files for each provider and outputs ``vehicles.geojson``.

The script does not fetch data itself; ensure the dataset is present
locally before running.
"""

import json
from pathlib import Path

DATASET_DIR = Path(__file__).resolve().parents[1] / "sharedmobility"
OUTPUT_PATH = DATASET_DIR / "vehicles.geojson"


def iter_feed_files(root: Path):
    """Yield paths to GBFS feed files for each provider."""
    for provider_dir in root.glob("*/*/"):  # example: provider/gbfs/
        if provider_dir.is_dir():
            for feed in [
                provider_dir / "free_bike_status.json",
                provider_dir / "station_information.json",
                provider_dir / "station_status.json",
            ]:
                if feed.exists():
                    yield feed


def convert():
    features = []
    for feed_path in iter_feed_files(DATASET_DIR):
        try:
            data = json.loads(feed_path.read_text())
        except Exception:
            continue

        if feed_path.name == "free_bike_status.json":
            bikes = data.get("data", {}).get("bikes", [])
            for bike in bikes:
                lon = bike.get("lon")
                lat = bike.get("lat")
                if lon is None or lat is None:
                    continue
                properties = {k: v for k, v in bike.items() if k not in {"lat", "lon"}}
                features.append(
                    {
                        "type": "Feature",
                        "geometry": {"type": "Point", "coordinates": [lon, lat]},
                        "properties": properties,
                    }
                )
        elif feed_path.name == "station_information.json":
            stations = data.get("data", {}).get("stations", [])
            for st in stations:
                lon = st.get("lon")
                lat = st.get("lat")
                if lon is None or lat is None:
                    continue
                properties = {k: v for k, v in st.items() if k not in {"lat", "lon"}}
                features.append(
                    {
                        "type": "Feature",
                        "geometry": {"type": "Point", "coordinates": [lon, lat]},
                        "properties": properties,
                    }
                )
        elif feed_path.name == "station_status.json":
            # merge status into existing station features by station_id
            status_map = {
                st.get("station_id"): st
                for st in data.get("data", {}).get("stations", [])
            }
            for feat in features:
                sid = feat["properties"].get("station_id")
                if sid in status_map:
                    feat["properties"].update(status_map[sid])

    geojson = {"type": "FeatureCollection", "features": features}
    OUTPUT_PATH.write_text(json.dumps(geojson, ensure_ascii=False, indent=2))
    print(f"Wrote {len(features)} features to {OUTPUT_PATH}")


if __name__ == "__main__":
    convert()
