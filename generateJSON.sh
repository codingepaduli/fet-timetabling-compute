#!/bin/bash

echo "let aule = " > "./data/aule.js"
csvjson --indent 4 "data/classi27Nov.csv" >> "data/aule.js"

echo "let timetable = "> "data/timetable.js"
csvjson --indent 4  --no-inference  "data/timetable27Nov.csv" >> "data/timetable.js"
