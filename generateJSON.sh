#!/bin/bash

ORIGINAL_AULE_CSV="./original/classi05Apr.csv"
ORIGINAL_TIMETABLE_CSV="./original/timetable05Apr.csv"

WORKING_AULE_CSV="./data/classi05Apr.csv"
WORKING_TIMETABLE_CSV="./data/timetable05Apr.csv"

AULE_JSON="./data/classi.js"
TIMETABLE_JSON="./data/timetable.js"

# Mantengo la prima riga del file CSV
head -n 1 "$ORIGINAL_AULE_CSV" > "$WORKING_AULE_CSV"
head -n 1 "$ORIGINAL_TIMETABLE_CSV" > "$WORKING_TIMETABLE_CSV"

# Provo le altre righe
# rg is ripgrep, unicode enabled search and replace tool
# --passthru option is useful to print all lines, whether or not it matched
# -N will disable line number prefix
# this command is similar to: sed 's/blue/red/g' file.txt
tail -n +2 "$ORIGINAL_AULE_CSV" | rg -N --passthru 'à' -r 'a' | rg -N --passthru 'è' -r 'e' | rg -N --passthru 'é' -r 'e' | rg -N --passthru 'ì' -r 'i' | rg -N --passthru 'ò' -r 'o' | rg -N --passthru 'ù' -r 'u' | tr '[:lower:]' '[:upper:]'  >> "$WORKING_AULE_CSV"
tail -n +2 "$ORIGINAL_TIMETABLE_CSV" |  rg -N --passthru 'à' -r 'a' | rg -N --passthru 'è' -r 'e' | rg -N --passthru 'é' -r 'e' | rg -N --passthru 'ì' -r 'i' | rg -N --passthru 'ò' -r 'o' | rg -N --passthru 'ù' -r 'u' | tr '[:lower:]' '[:upper:]' >> "$WORKING_TIMETABLE_CSV"

# Creo la prima riga dei file JS
echo "let aule = " > "$AULE_JSON"
echo "let timetable = "> "$TIMETABLE_JSON"

# Creo il contenuto dei file JS
#   csvjson --no-inference  --> Disable type inference 
#   (and --locale, --date-format --datetime-format) when parsing CSV input
csvjson --indent 4 "$WORKING_AULE_CSV" >> "$AULE_JSON"
csvjson --no-inference --indent 4 "$WORKING_TIMETABLE_CSV" >> "$TIMETABLE_JSON"

