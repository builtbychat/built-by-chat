#!/usr/bin/env bash
set -euo pipefail
if [[ $# -lt 3 ]]; then echo "Usage: $0 recording.mkv markers.csv output-dir" >&2; exit 2; fi
input=$1; markers=$2; output=$3; mkdir -p "$output"
while IFS=, read -r start duration name; do
  [[ "$start" == "start" || -z "$start" ]] && continue
  safe=$(printf '%s' "$name" | tr -cs '[:alnum:]_-' '-')
  ffmpeg -hide_banner -loglevel error -ss "$start" -i "$input" -t "$duration" -c:v libx264 -c:a aac -movflags +faststart "$output/${safe}.mp4"
done < "$markers"
