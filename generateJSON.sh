#!/bin/bash

ORIGINAL_AULE_CSV="./original/classi05Apr.csv"
ORIGINAL_EXTRA_AULE_CSV="./original/addedClasses.csv"
ORIGINAL_TIMETABLE_CSV="./original/timetable05Apr.csv"

WORKING_AULE_CSV="./data/classi05Apr.csv"
WORKING_EXTRA_AULE_CSV="./data/addedClasses.csv"
WORKING_TIMETABLE_CSV="./data/timetable05Apr.csv"

AULE_JSON="./data/classi.js"
EXTRA_AULE_JSON="./data/addedClasses.js"
TIMETABLE_JSON="./data/timetable.js"

# Mantengo la prima riga del file CSV
head -n 1 "$ORIGINAL_AULE_CSV" > "$WORKING_AULE_CSV"
head -n 1 "$ORIGINAL_EXTRA_AULE_CSV" > "$WORKING_EXTRA_AULE_CSV"
head -n 1 "$ORIGINAL_TIMETABLE_CSV" > "$WORKING_TIMETABLE_CSV"

# Provo le altre righe
# rg is ripgrep, unicode enabled search and replace tool
# --passthru option is useful to print all lines, whether or not it matched
# -N will disable line number prefix
# this command is similar to: sed 's/blue/red/g' file.txt
tail -n +2 "$ORIGINAL_AULE_CSV"       | rg -N --passthru 'à' -r 'a' | rg -N --passthru 'è' -r 'e' | rg -N --passthru 'é' -r 'e' | rg -N --passthru 'ì' -r 'i' | rg -N --passthru 'ò' -r 'o' | rg -N --passthru 'ù' -r 'u' | tr '[:lower:]' '[:upper:]' >> "$WORKING_AULE_CSV"
tail -n +2 "$ORIGINAL_EXTRA_AULE_CSV" | rg -N --passthru 'à' -r 'a' | rg -N --passthru 'è' -r 'e' | rg -N --passthru 'é' -r 'e' | rg -N --passthru 'ì' -r 'i' | rg -N --passthru 'ò' -r 'o' | rg -N --passthru 'ù' -r 'u' | tr '[:lower:]' '[:upper:]' >> "$WORKING_EXTRA_AULE_CSV"
tail -n +2 "$ORIGINAL_TIMETABLE_CSV"  | rg -N --passthru 'à' -r 'a' | rg -N --passthru 'è' -r 'e' | rg -N --passthru 'é' -r 'e' | rg -N --passthru 'ì' -r 'i' | rg -N --passthru 'ò' -r 'o' | rg -N --passthru 'ù' -r 'u' | tr '[:lower:]' '[:upper:]' >> "$WORKING_TIMETABLE_CSV"

# Creo la prima riga dei file JS
echo "let aule = " > "$AULE_JSON"
echo "let extraClasses = " > "$EXTRA_AULE_JSON"
echo "let timetable = "> "$TIMETABLE_JSON"

# Creo il contenuto dei file JS
#   csvjson --no-inference  --> Disable type inference 
#   (and --locale, --date-format --datetime-format) when parsing CSV input
csvjson --indent 4 "$WORKING_AULE_CSV" >> "$AULE_JSON"
csvjson --indent 4 "$WORKING_EXTRA_AULE_CSV" >> "$EXTRA_AULE_JSON"
csvjson --no-inference --indent 4 "$WORKING_TIMETABLE_CSV" >> "$TIMETABLE_JSON"

mkdir -p libs-min

uglifyjs --compress --mangle -o "./libs-min/addedClasses.min.js"      "./data/addedClasses.js" 
uglifyjs --compress --mangle -o "./libs-min/classi.min.js"            "./data/classi.js" 
uglifyjs --compress --mangle -o "./libs-min/timetable.min.js"         "./data/timetable.js" 

uglifyjs --compress --mangle -o "./libs-min/aggiungiExtraAula.min.js" "./libs/aggiungiExtraAula.js" 
uglifyjs --compress --mangle -o "./libs-min/cercaAula.min.js"         "./libs/cercaAula.js" 
uglifyjs --compress --mangle -o "./libs-min/consoleOverwrite.min.js"  "./libs/consoleOverwrite.js" 
uglifyjs --compress --mangle -o "./libs-min/pantryCrud.min.js"        "./libs/pantryCrud.js" 
uglifyjs --compress --mangle -o "./libs-min/templateUtils.min.js"     "./libs/templateUtils.js" 

# Seach in path: -path ./libs/*

# find ./ -type f -path "./libs/*" -name "*.js" ! -name "*.min.*" \
#     -exec echo {} \; \
#     -exec bash -c 'uglifyjs --compress --mangle -o "../libs-min/{}".min "../{}"'  \;


# cd libs
# 
# for file in *.js
# do
#   filename=$(basename $file .js)
#   uglifyjs --compress --mangle -o $filename.min.js $filename.js
# done
# 
# cd ..
# 