for f in *.heic; do
  sips -s format jpeg "$f" --out "${f%.heic}"
done
