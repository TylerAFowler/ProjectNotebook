---
type: note
project: "[[RoadView Backend]]"
created: 2026-11-24
---
# Upload chunk size notes


| Part size | Parts for 4 GB | Retry cost on drop |
| --------- | -------------- | ------------------ |
| 16 MB | 256 | tiny, but too many requests |
| **64 MB** | **64** | **~10 s on LTE** ← chosen |
| 256 MB | 16 | ~40 s, too much on weak signal |
