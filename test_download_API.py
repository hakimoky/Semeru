import requests
import json

url = "https://meteojuanda.id/share/api-semeru/aws.json"
resp = requests.get(url, timeout=10)
resp.raise_for_status()

data = resp.json()

with open("weather_semeru.geojson", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("File weather_semeru.geojson berhasil disimpan")