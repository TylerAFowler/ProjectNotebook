#!/usr/bin/env python3
"""Builds the fictional "ObsidianNotesDemo" monorepo used by the showcase vault: realistic backdated
commits from several fictional developers on several branches, so the Git sections, daily commits
and weekly review have something real to show.

    python3 tools/make-demo-code.py <output-dir>          # creates <output-dir>/ObsidianNotesDemo (git repo)
                                                          # and <output-dir>/ObsidianNotesDemo.bundle

Dates are fixed (Sep-Nov 2026) so the commit SHAs are reproducible and match the links in the showcase.
"""
import os, subprocess, sys, textwrap

OUT = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else ".")
REPO = os.path.join(OUT, "ObsidianNotesDemo")

PEOPLE = {
    "alex":   ("Alex Rivera",   "alex.rivera@example.gov"),
    "sam":    ("Sam Okafor",    "sam.okafor@example.gov"),
    "lena":   ("Lena Park",     "lena.park@example.gov"),
    "jordan": ("Jordan Ellis",  "jordan.ellis@example.gov"),
    "nina":   ("Nina Shah",     "nina.shah@example.gov"),
}

def git(*args, env=None):
    e = dict(os.environ, **(env or {}))
    return subprocess.run(["git", *args], cwd=REPO, env=e, check=True, capture_output=True, text=True).stdout.strip()

def stamp(who, when):
    name, mail = PEOPLE[who]
    d = f"{when} -0500"
    return {"GIT_AUTHOR_NAME": name, "GIT_AUTHOR_EMAIL": mail, "GIT_AUTHOR_DATE": d,
            "GIT_COMMITTER_NAME": name, "GIT_COMMITTER_EMAIL": mail, "GIT_COMMITTER_DATE": d}

def write(path, text, append=False):
    p = os.path.join(REPO, path)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "a" if append else "w", newline="\n") as f:
        f.write(textwrap.dedent(text).lstrip("\n"))

def commit(branch, who, when, msg, files):
    """files: {path: text} (overwrite) or {path: ("+", text)} (append)."""
    if git("symbolic-ref", "--short", "HEAD") != branch: git("checkout", "-q", branch)
    for path, text in files.items():
        if isinstance(text, tuple): write(path, text[1], append=True)
        else: write(path, text)
    git("add", "-A")
    git("commit", "-q", "-m", msg, env=stamp(who, when))

def branch(name, frm="main"):
    git("checkout", "-q", frm); git("checkout", "-q", "-b", name)

def merge(name, who, when, into="main"):
    git("checkout", "-q", into)
    git("merge", "-q", "--no-ff", name, "-m", f"Merge branch '{name}'", env=stamp(who, when))

if os.path.exists(REPO): sys.exit(f"{REPO} already exists; delete it first.")
os.makedirs(REPO)
git("init", "-q"); git("checkout", "-q", "-b", "main")
git("config", "core.autocrlf", "false")

# ---------------- history before November ----------------
commit("main", "alex", "2026-09-14 09:12:00", "Initial repo layout", {
    "README.md": """
        # Highway Data Services: shared code

        Fictional demo monorepo for the Obsidian notes showcase.

        | Folder | What |
        | ------ | ---- |
        | `crash-dashboard/etl` | Loads the yearly crash extract into staging and validates it |
        | `crash-dashboard/app` | Public crash dashboard (Flask) |
        | `crash-dashboard/reports` | Recurring extracts (FHWA monthly, fatality quarterly) |
        | `roadview/backend` | RoadView field-video API: uploads, clips, retention |
        | `roadview/frontend` | RoadView web viewer |
        | `roadview/inference` | Sign / guardrail detection on uploaded video |
        | `infra/terraform` | Cloud tenancy: network, buckets, compute |
        | `infra/sso` | SAML service-provider config for the SSO migration |
        """,
    ".gitignore": "__pycache__/\n*.pyc\nnode_modules/\n.terraform/\n*.tfstate*\n.env\n",
})
commit("main", "alex", "2026-09-15 14:40:00", "crash-dashboard: Flask skeleton and county lookup", {
    "crash-dashboard/app/app.py": """
        from flask import Flask, jsonify, request
        from .db import query

        app = Flask(__name__)

        @app.get("/api/crashes/summary")
        def summary():
            year = int(request.args.get("year", 2024))
            rows = query("summary_by_county.sql", year=year)
            return jsonify(rows)
        """,
    "crash-dashboard/app/db.py": """
        import os, oracledb
        from pathlib import Path

        SQL = Path(__file__).parent / "sql"

        def query(name, **params):
            with oracledb.connect(dsn=os.environ["CRASH_DSN"]) as conn:
                cur = conn.cursor()
                cur.execute((SQL / name).read_text(), params)
                cols = [c[0].lower() for c in cur.description]
                return [dict(zip(cols, r)) for r in cur.fetchall()]
        """,
    "crash-dashboard/app/sql/summary_by_county.sql": """
        SELECT county_name, COUNT(*) AS crashes,
               SUM(CASE WHEN severity = 'K' THEN 1 ELSE 0 END) AS fatal
        FROM crash_rpt.crash c JOIN crash_rpt.county k ON k.county_code = c.county_code
        WHERE EXTRACT(YEAR FROM c.crash_date) = :year
        GROUP BY county_name ORDER BY crashes DESC
        """,
})
commit("main", "sam", "2026-09-21 10:05:00", "roadview/backend: FastAPI skeleton with clip listing", {
    "roadview/backend/api/main.py": """
        from fastapi import FastAPI
        from .clips import router as clips

        app = FastAPI(title="RoadView API")
        app.include_router(clips, prefix="/clips")
        """,
    "roadview/backend/api/clips.py": """
        from fastapi import APIRouter, Query
        from ..storage import list_clips

        router = APIRouter()

        @router.get("")
        def get_clips(route: str | None = None, page: int = Query(1, ge=1), size: int = 50):
            return list_clips(route=route, offset=(page - 1) * size, limit=size)
        """,
    "roadview/backend/storage.py": """
        import os
        import boto3

        BUCKET = os.environ.get("CLIP_BUCKET", "roadview-clips")
        s3 = boto3.client("s3", endpoint_url=os.environ.get("OBJECT_STORE_URL"))

        def list_clips(route=None, offset=0, limit=50):
            prefix = f"clips/{route}/" if route else "clips/"
            keys = [o["Key"] for o in s3.list_objects_v2(Bucket=BUCKET, Prefix=prefix).get("Contents", [])]
            return keys[offset:offset + limit]
        """,
})
commit("main", "lena", "2026-09-22 13:30:00", "roadview/frontend: Vite + React skeleton, clip list", {
    "roadview/frontend/package.json": """
        {
          "name": "roadview-frontend",
          "private": true,
          "scripts": { "dev": "vite", "build": "vite build" },
          "dependencies": { "react": "^18.3.1", "react-dom": "^18.3.1", "leaflet": "^1.9.4" },
          "devDependencies": { "vite": "^5.4.0", "typescript": "^5.5.0" }
        }
        """,
    "roadview/frontend/src/ClipList.tsx": """
        import { useEffect, useState } from "react";

        export function ClipList({ route }: { route?: string }) {
          const [clips, setClips] = useState<string[]>([]);
          useEffect(() => {
            fetch(`/api/clips?route=${route ?? ""}`).then(r => r.json()).then(setClips);
          }, [route]);
          return <ul>{clips.map(c => <li key={c}>{c}</li>)}</ul>;
        }
        """,
})
commit("main", "nina", "2026-09-28 11:00:00", "roadview/inference: sign detection batch job", {
    "roadview/inference/detect.py": """
        \"\"\"Runs the sign/guardrail detector over new clips and writes detections to the API.\"\"\"
        import sys
        from ultralytics import YOLO

        MODEL = YOLO("models/signs-v8.pt")

        def detect(path, conf=0.35):
            for r in MODEL.predict(path, conf=conf, stream=True):
                for b in r.boxes:
                    yield {"frame": r.path, "cls": MODEL.names[int(b.cls)], "conf": float(b.conf)}

        if __name__ == "__main__":
            for d in detect(sys.argv[1]):
                print(d)
        """,
    "roadview/inference/models/README.md": "Model weights live in the model bucket, not in git. `signs-v8.pt` is the current production model.\n",
})
commit("main", "jordan", "2026-10-05 15:20:00", "infra/terraform: VCN, subnets and clip bucket", {
    "infra/terraform/main.tf": """
        terraform {
          required_providers { oci = { source = "oracle/oci", version = "~> 6.10" } }
        }

        module "network" {
          source         = "./modules/network"
          compartment_id = var.compartment_id
          cidr_block     = "10.40.0.0/16"
        }

        resource "oci_objectstorage_bucket" "clips" {
          compartment_id = var.compartment_id
          namespace      = var.namespace
          name           = "roadview-clips"
          versioning     = "Disabled"
        }
        """,
    "infra/terraform/variables.tf": 'variable "compartment_id" {}\nvariable "namespace" {}\n',
})

branch("old/csv-export")
commit("old/csv-export", "alex", "2026-10-06 16:10:00", "WIP: CSV export of the county summary", {
    "crash-dashboard/app/export.py": """
        import csv, io
        from .db import query

        def county_csv(year):
            buf = io.StringIO()
            rows = query("summary_by_county.sql", year=year)
            w = csv.DictWriter(buf, fieldnames=rows[0].keys()); w.writeheader(); w.writerows(rows)
            return buf.getvalue()
        """,
})
commit("old/csv-export", "alex", "2026-10-07 09:45:00", "WIP: export endpoint (parked, dashboard refresh will replace this)", {
    "crash-dashboard/app/export.py": ("+", """

        # TODO: wire to /api/crashes/export once the dashboard refresh decides on formats
        """),
})

commit("main", "alex", "2026-10-14 10:30:00", "reports: FHWA monthly extract query", {
    "crash-dashboard/reports/fhwa_monthly.sql": """
        -- Monthly FHWA extract: every crash reported in the previous month, one row per vehicle.
        SELECT c.crash_id, c.crash_date, c.county_code, c.route_id, c.milepost, c.severity,
               v.vehicle_no, v.body_type, v.contributing_factor
        FROM crash_rpt.crash c JOIN crash_rpt.vehicle v ON v.crash_id = c.crash_id
        WHERE c.report_date >= ADD_MONTHS(TRUNC(SYSDATE, 'MM'), -1)
          AND c.report_date <  TRUNC(SYSDATE, 'MM')
        ORDER BY c.crash_id, v.vehicle_no
        """,
})
commit("main", "sam", "2026-10-20 13:15:00", "backend: upload endpoint (single PUT, 2 GB limit)", {
    "roadview/backend/api/upload.py": """
        from fastapi import APIRouter, UploadFile
        from ..storage import s3, BUCKET

        router = APIRouter()

        @router.put("/{route}/{clip_id}")
        async def upload(route: str, clip_id: str, file: UploadFile):
            s3.upload_fileobj(file.file, BUCKET, f"clips/{route}/{clip_id}.mp4")
            return {"ok": True}
        """,
})
commit("main", "lena", "2026-10-27 11:50:00", "frontend: clip viewer with timestamp overlay", {
    "roadview/frontend/src/ClipViewer.tsx": """
        export function ClipViewer({ src, recordedAt }: { src: string; recordedAt: string }) {
          return (
            <figure>
              <video src={src} controls width={960} />
              <figcaption>{new Date(recordedAt).toLocaleString()}</figcaption>
            </figure>
          );
        }
        """,
})

# ---------------- November: 2025 crash data load (merged) ----------------
branch("feature/2025-load")
commit("feature/2025-load", "alex", "2026-11-03 09:20:00", "etl: staging tables for the 2025 extract", {
    "crash-dashboard/etl/ddl/stg_crash_2025.sql": """
        CREATE TABLE crash_stg.crash_2025 (
          crash_id      VARCHAR2(20) PRIMARY KEY,
          crash_date    DATE NOT NULL,
          county_code   VARCHAR2(3),
          route_id      VARCHAR2(20),
          milepost      NUMBER(7,3),
          severity      CHAR(1),
          latitude      NUMBER(9,6),
          longitude     NUMBER(9,6)
        );
        """,
})
commit("feature/2025-load", "alex", "2026-11-05 14:05:00", "etl: loader for the vendor extract (pipe-delimited)", {
    "crash-dashboard/etl/load_2025.py": """
        \"\"\"Loads the vendor's 2025 crash extract (pipe-delimited) into crash_stg.crash_2025.\"\"\"
        import csv, os, sys, oracledb

        BATCH = 5000

        def rows(path):
            with open(path, newline="", encoding="utf-8") as f:
                for r in csv.DictReader(f, delimiter="|"):
                    yield (r["CRASH_ID"], r["CRASH_DATE"], r["COUNTY_CD"], r["ROUTE_ID"] or None,
                           r["MILEPOST"] or None, r["SEVERITY"], r["LAT"] or None, r["LON"] or None)

        def main(path):
            with oracledb.connect(dsn=os.environ["STG_DSN"]) as conn:
                cur, batch = conn.cursor(), []
                for r in rows(path):
                    batch.append(r)
                    if len(batch) == BATCH:
                        cur.executemany(INSERT, batch); batch.clear()
                if batch: cur.executemany(INSERT, batch)
                conn.commit()

        INSERT = "INSERT INTO crash_stg.crash_2025 VALUES (:1, TO_DATE(:2,'YYYY-MM-DD'), :3, :4, :5, :6, :7, :8)"

        if __name__ == "__main__":
            main(sys.argv[1])
        """,
})
commit("main", "jordan", "2026-11-09 10:40:00", "terraform: lifecycle rule to archive clips after 90 days", {
    "infra/terraform/main.tf": ("+", """

        resource "oci_objectstorage_object_lifecycle_policy" "clips" {
          namespace = var.namespace
          bucket    = oci_objectstorage_bucket.clips.name
          rules {
            name        = "archive-after-90-days"
            action      = "ARCHIVE"
            time_amount = 90
            time_unit   = "DAYS"
            is_enabled  = true
          }
        }
        """),
})
commit("feature/2025-load", "alex", "2026-11-10 15:30:00", "etl: skip rows with unparseable dates, log them", {
    "crash-dashboard/etl/load_2025.py": ("+", """

        # Rows whose CRASH_DATE fails to parse are written to rejects.csv instead of failing the load.
        """),
})
commit("feature/2025-load", "alex", "2026-11-12 11:10:00", "etl: geocode fallback (county + milepost) when route ID is null", {
    "crash-dashboard/etl/geocode.py": """
        from .lrs import locate, locate_by_county_milepost

        def geocode(route_id, county_code, milepost):
            \"\"\"LRS v2 lookup; falls back to county + milepost when the route ID is missing.\"\"\"
            if route_id:
                return locate(route_id, milepost)
            return locate_by_county_milepost(county_code, milepost)
        """,
})
merge("feature/2025-load", "alex", "2026-11-13 09:00:00")

# ---------------- RoadView: resumable uploads (in progress, two people) ----------------
branch("feature/resumable-uploads")
commit("feature/resumable-uploads", "sam", "2026-11-10 10:15:00", "backend: multipart upload session table", {
    "roadview/backend/uploads/session.py": """
        from dataclasses import dataclass, field
        from datetime import datetime, timezone

        @dataclass
        class UploadSession:
            clip_id: str
            route: str
            upload_id: str                 # object-store multipart upload id
            parts: dict[int, str] = field(default_factory=dict)   # part number -> etag
            started: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
        """,
})
commit("feature/resumable-uploads", "sam", "2026-11-12 16:20:00", "backend: start/part/complete endpoints for chunked uploads", {
    "roadview/backend/api/upload.py": ("+", """

        CHUNK = 64 * 1024 * 1024   # 64 MB parts

        @router.post("/{route}/{clip_id}/start")
        def start(route: str, clip_id: str): ...

        @router.put("/{route}/{clip_id}/part/{n}")
        async def part(route: str, clip_id: str, n: int, file: UploadFile): ...

        @router.post("/{route}/{clip_id}/complete")
        def complete(route: str, clip_id: str): ...
        """),
})
commit("feature/resumable-uploads", "alex", "2026-11-17 13:45:00", "backend: resume from last confirmed part after a dropped connection", {
    "roadview/backend/uploads/resume.py": """
        def next_part(session):
            \"\"\"First part number the truck still has to send (parts are 1-based and contiguous).\"\"\"
            n = 1
            while n in session.parts:
                n += 1
            return n
        """,
})
commit("feature/resumable-uploads", "alex", "2026-11-20 10:30:00", "backend: expire abandoned upload sessions after 48h", {
    "roadview/backend/uploads/cleanup.py": """
        from datetime import datetime, timedelta, timezone

        MAX_AGE = timedelta(hours=48)

        def expired(sessions, now=None):
            now = now or datetime.now(timezone.utc)
            return [s for s in sessions if now - s.started > MAX_AGE]
        """,
})
commit("feature/resumable-uploads", "sam", "2026-11-23 15:55:00", "backend: tests for resume and cleanup", {
    "roadview/backend/tests/test_resume.py": """
        from roadview.backend.uploads.session import UploadSession
        from roadview.backend.uploads.resume import next_part

        def test_resume_after_gap():
            s = UploadSession("c1", "I-79", "u1", parts={1: "a", 2: "b"})
            assert next_part(s) == 3
        """,
})

# ---------------- RoadView: timestamp fix (merged this week-ish) ----------------
branch("fix/clip-timestamp-tz")
commit("fix/clip-timestamp-tz", "alex", "2026-11-18 09:40:00", "backend: store recorded_at in UTC (trucks send local time)", {
    "roadview/backend/api/clips.py": ("+", """

        # Trucks report local time without an offset; convert to UTC on ingest (see issue: clip timestamps off by 5h).
        """),
})
commit("fix/clip-timestamp-tz", "alex", "2026-11-19 14:15:00", "frontend: show clip time in the viewer's time zone", {
    "roadview/frontend/src/ClipViewer.tsx": ("+", """

        // recordedAt is UTC from the API; toLocaleString() shows it in the viewer's zone.
        """),
})
merge("fix/clip-timestamp-tz", "alex", "2026-11-20 08:55:00")

# ---------------- RoadView: frontend map clustering (Lena) ----------------
branch("feature/map-clustering")
commit("feature/map-clustering", "lena", "2026-11-17 11:05:00", "frontend: map view of clip locations", {
    "roadview/frontend/src/MapView.tsx": """
        import L from "leaflet";
        import { useEffect, useRef } from "react";

        export function MapView({ points }: { points: { lat: number; lon: number; id: string }[] }) {
          const el = useRef<HTMLDivElement>(null);
          useEffect(() => {
            const map = L.map(el.current!).setView([38.6, -80.6], 7);
            L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
            points.forEach(p => L.marker([p.lat, p.lon]).addTo(map));
            return () => { map.remove(); };
          }, [points]);
          return <div ref={el} style={{ height: 480 }} />;
        }
        """,
})
commit("feature/map-clustering", "lena", "2026-11-19 15:30:00", "frontend: cluster markers above 500 points", {
    "roadview/frontend/package.json": """
        {
          "name": "roadview-frontend",
          "private": true,
          "scripts": { "dev": "vite", "build": "vite build" },
          "dependencies": { "react": "^18.3.1", "react-dom": "^18.3.1", "leaflet": "^1.9.4", "leaflet.markercluster": "^1.5.3" },
          "devDependencies": { "vite": "^5.4.0", "typescript": "^5.5.0" }
        }
        """,
})
commit("feature/map-clustering", "lena", "2026-11-23 10:20:00", "frontend: click a cluster to filter the clip list", {
    "roadview/frontend/src/MapView.tsx": ("+", "\n// Clicking a cluster calls onSelect(ids) so ClipList can filter to those clips.\n"),
})

# ---------------- RoadView: inference experiment (Nina) ----------------
branch("experiment/yolo-v9")
commit("experiment/yolo-v9", "nina", "2026-11-11 13:00:00", "inference: try YOLOv9 weights on the guardrail set", {
    "roadview/inference/experiments/yolo_v9.md": """
        # YOLOv9 vs v8 on guardrail damage

        | Model | mAP50 | Frames/s (T4) |
        | ----- | ----- | ------------- |
        | v8m   | 0.71  | 41            |
        | v9c   | 0.76  | 29            |
        """,
})
commit("experiment/yolo-v9", "nina", "2026-11-19 16:40:00", "inference: v9 batch size 8 keeps us inside the nightly window", {
    "roadview/inference/experiments/yolo_v9.md": ("+", "\nBatch size 8 on the GPU node: 3h10m for a typical night (window is 4h).\n"),
})

# ---------------- SSO migration (infra/sso) ----------------
branch("feature/saml-sp-config")
commit("feature/saml-sp-config", "jordan", "2026-11-16 10:00:00", "sso: SP metadata for the test IdP", {
    "infra/sso/sp-metadata.test.xml": """
        <EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" entityID="https://crash-dashboard.test.example.gov/saml">
          <SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol" AuthnRequestsSigned="true">
            <AssertionConsumerService index="0" Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
                                      Location="https://crash-dashboard.test.example.gov/saml/acs"/>
          </SPSSODescriptor>
        </EntityDescriptor>
        """,
})
commit("feature/saml-sp-config", "alex", "2026-11-19 11:25:00", "sso: map the IdP's groups claim to dashboard roles", {
    "infra/sso/claims.yaml": """
        # IdP attribute -> app role. Group names come from the directory (see KB: SAML claims cheat sheet).
        groups_claim: http://schemas.microsoft.com/ws/2008/06/identity/claims/groups
        roles:
          CrashDashboard-Admins: admin
          CrashDashboard-Analysts: analyst
          default: viewer
        """,
})
commit("feature/saml-sp-config", "alex", "2026-11-24 09:30:00", "sso: sign AuthnRequests with the new SP cert (test only)", {
    "infra/sso/README.md": """
        # SSO (SAML) service-provider config

        - `sp-metadata.test.xml`: register this with the **test** IdP. Prod metadata comes after the pilot.
        - The SP signing cert lives in the vault (`sso-sp-signing-test`); it is not in git.
        - Clock skew allowed: 2 minutes.
        """,
})

# ---------------- crash-dashboard: county validation (in progress, mine) ----------------
branch("feature/county-validation")
commit("feature/county-validation", "alex", "2026-11-16 15:10:00", "etl: county code validation query", {
    "crash-dashboard/etl/validation/county_codes.sql": """
        -- Rows whose county code is not in the state county list (requirement CDL-REQ-001).
        SELECT s.crash_id, s.county_code
        FROM crash_stg.crash_2025 s
        LEFT JOIN crash_rpt.county k ON k.county_code = s.county_code
        WHERE k.county_code IS NULL
        """,
})
commit("feature/county-validation", "alex", "2026-11-18 10:45:00", "etl: also accept FIPS codes, map them to state codes", {
    "crash-dashboard/etl/validation/county_codes.sql": ("+", """

        -- FIPS codes (54xxx) are accepted and mapped through crash_rpt.county_fips.
        """),
})
commit("feature/county-validation", "alex", "2026-11-19 16:30:00", "etl: route ID validation against LRS v2", {
    "crash-dashboard/etl/validation/route_ids.sql": """
        -- Route IDs that LRS v2 does not know about (checked against the nightly LRS snapshot).
        SELECT s.crash_id, s.route_id
        FROM crash_stg.crash_2025 s
        WHERE s.route_id IS NOT NULL
          AND NOT EXISTS (SELECT 1 FROM lrs.route_v2 r WHERE r.route_id = s.route_id)
        """,
})
commit("feature/county-validation", "alex", "2026-11-23 13:20:00", "etl: validation summary report for Marcus", {
    "crash-dashboard/etl/validation/summary.sql": """
        SELECT 'county' AS check_name, COUNT(*) AS failures FROM (@county_codes.sql)
        UNION ALL
        SELECT 'route', COUNT(*) FROM (@route_ids.sql)
        """,
})
commit("feature/county-validation", "alex", "2026-11-24 10:12:00", "etl: run all validations from one script", {
    "crash-dashboard/etl/validate.py": """
        import os, sys, oracledb
        from pathlib import Path

        CHECKS = ["county_codes.sql", "route_ids.sql"]

        def main():
            with oracledb.connect(dsn=os.environ["STG_DSN"]) as conn:
                for name in CHECKS:
                    n = len(conn.cursor().execute((Path(__file__).parent / "validation" / name).read_text()).fetchall())
                    print(f"{name:20} {n:6} failures")

        if __name__ == "__main__":
            sys.exit(main())
        """,
})

# ---------------- main this month (various) ----------------
commit("main", "alex", "2026-11-17 09:15:00", "dashboard: add 2025 to the year filter", {
    "crash-dashboard/app/app.py": ("+", "\nYEARS = list(range(2019, 2026))   # 2025 added for the refresh\n"),
})
commit("main", "sam", "2026-11-19 10:00:00", "backend: /health endpoint for the load balancer", {
    "roadview/backend/api/main.py": ("+", """

        @app.get("/health")
        def health():
            return {"status": "ok"}
        """),
})
commit("main", "lena", "2026-11-20 14:35:00", "frontend: fix clip list paging (page 2 repeated page 1)", {
    "roadview/frontend/src/ClipList.tsx": ("+", "\n// Paging: pass page=N to the API (was always sending page=1).\n"),
})
commit("main", "alex", "2026-11-23 11:05:00", "reports: fatal crash counts by county (request from Marcus)", {
    "crash-dashboard/reports/fatal_by_county.sql": """
        SELECT k.county_name, COUNT(*) AS fatal_crashes, SUM(c.fatalities) AS fatalities
        FROM crash_rpt.crash c JOIN crash_rpt.county k ON k.county_code = c.county_code
        WHERE c.severity = 'K' AND EXTRACT(YEAR FROM c.crash_date) = 2025
        GROUP BY k.county_name ORDER BY fatal_crashes DESC
        """,
})
commit("main", "jordan", "2026-11-23 16:45:00", "terraform: bump OCI provider to 6.12", {
    "infra/terraform/main.tf": ("+", "\n# provider pinned to ~> 6.12 (fixes bucket lifecycle drift)\n"),
})

git("checkout", "-q", "main")
git("gc", "-q")
bundle = os.path.join(OUT, "ObsidianNotesDemo.bundle")
if os.path.exists(bundle): os.remove(bundle)
git("bundle", "create", bundle, "--all")
print("branches:", git("branch", "--format=%(refname:short)").replace("\n", ", "))
print("commits:", git("rev-list", "--all", "--count"))
print("bundle:", bundle)
