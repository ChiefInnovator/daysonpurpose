"""Regenerate data/lifeexpectancy.csv from UN World Population Prospects 2024.

Usage: python3 scripts/build_dataset.py
"""
import csv
import gzip
import io
import math
import sys
import tempfile
import urllib.request
from pathlib import Path

URL = (
    "https://population.un.org/wpp/assets/Excel%20Files/1_Indicator%20(Standard)/"
    "CSV_FILES/WPP2024_Demographic_Indicators_Medium.csv.gz"
)
YEAR = "2023"  # last estimate year in WPP 2024; 2024 onward is projection
SOURCE = "UN WPP 2024"
OUT = Path(__file__).resolve().parent.parent / "data" / "lifeexpectancy.csv"
REQUIRED = ["Location", "ISO2_code", "LocTypeName", "Time", "LExMale", "LExFemale", "LEx"]

RENAMES = {
    "United States of America": "United States",
    "Bolivia (Plurinational State of)": "Bolivia",
    "Brunei Darussalam": "Brunei",
    "Democratic Republic of the Congo": "DR Congo",
    "China, Hong Kong SAR": "Hong Kong",
    "China, Macao SAR": "Macao",
    "China, Taiwan Province of China": "Taiwan",
    "Iran (Islamic Republic of)": "Iran",
    "Lao People's Democratic Republic": "Laos",
    "Micronesia (Fed. States of)": "Micronesia",
    "Republic of Moldova": "Moldova",
    "Dem. People's Republic of Korea": "North Korea",
    "Republic of Korea": "South Korea",
    "Russian Federation": "Russia",
    "Syrian Arab Republic": "Syria",
    "United Republic of Tanzania": "Tanzania",
    "Venezuela (Bolivarian Republic of)": "Venezuela",
    "Viet Nam": "Vietnam",
    "Bonaire, Sint Eustatius and Saba": "Caribbean Netherlands",
}


def fail(msg):
    sys.exit(f"build_dataset: {msg}")


def number(value, where):
    try:
        n = float(value)
    except ValueError:
        fail(f"non-numeric value {value!r} for {where}")
    if not math.isfinite(n):
        fail(f"non-finite value for {where}")
    return f"{n:.2f}"


def main():
    with tempfile.TemporaryDirectory() as tmp:
        gz = Path(tmp) / "wpp.csv.gz"
        urllib.request.urlretrieve(URL, gz)
        with gzip.open(gz, "rt", encoding="utf-8") as fh:
            reader = csv.DictReader(fh)
            missing = [c for c in REQUIRED if c not in (reader.fieldnames or [])]
            if missing:
                fail(f"missing columns {missing}")
            rows = [
                r for r in reader
                if r["LocTypeName"] == "Country/Area" and r["ISO2_code"] and r["Time"] == YEAR
            ]

    used, seen, out = set(), set(), []
    for r in rows:
        name = RENAMES.get(r["Location"], r["Location"])
        if r["Location"] in RENAMES:
            used.add(r["Location"])
        if "," in name:
            fail(f"name contains a comma: {name!r}")
        iso2 = r["ISO2_code"]
        if iso2 in seen:
            fail(f"duplicate ISO2 {iso2}")
        seen.add(iso2)
        out.append([name, iso2, number(r["LExMale"], name), number(r["LExFemale"], name),
                    number(r["LEx"], name), SOURCE, YEAR])

    unused = set(RENAMES) - used
    if unused:
        fail(f"rename keys matched no row: {sorted(unused)}")

    out.sort(key=lambda row: row[0])
    buf = io.StringIO()
    w = csv.writer(buf, lineterminator="\n")
    w.writerow(["name", "iso2", "male", "female", "total", "source", "year"])
    w.writerows(out)
    OUT.write_text(buf.getvalue(), encoding="utf-8")
    print(f"wrote {len(out)} rows to {OUT}")


if __name__ == "__main__":
    main()
