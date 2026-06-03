#!/bin/bash
# HLS Transcoding script for VashtyNime (Unix version)
# File: c:\VashtyNime\scripts\hls_converter.sh

# Exit immediately if any command fails
set -e

# Help message
show_help() {
  echo "Usage: ./hls_converter.sh [input_mp4_path] [output_directory_path]"
  echo ""
  echo "Example:"
  echo "  ./hls_converter.sh my_anime.mp4 c:/VashtyNime/storage/naruto/episode1"
  exit 1
}

# Input variables
INPUT_VIDEO=$1
OUTPUT_DIR=$2

if [ -z "$INPUT_VIDEO" ] || [ -z "$OUTPUT_DIR" ]; then
  show_help
fi

# Ensure output directory exists
mkdir -p "$OUTPUT_DIR"

echo "============================================="
echo "Starting HLS Transcode: $INPUT_VIDEO"
echo "Target Output Directory: $OUTPUT_DIR"
echo "============================================="

# Standard FFmpeg command for copying codecs and chunking into 10 second segments
ffmpeg -i "$INPUT_VIDEO" \
  -codec:copy \
  -start_number 0 \
  -hls_time 10 \
  -hls_list_size 0 \
  -f hls \
  "$OUTPUT_DIR/index.m3u8"

echo "============================================="
echo "Success! Transcoding completed."
echo "Created playlist file: $OUTPUT_DIR/index.m3u8"
echo "============================================="
