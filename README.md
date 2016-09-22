## How to run
- Create mysql database (config template uses localhost and db named 'stopfrisk')
- Get 2015 csv zip archive from [NYPD Stop, Question and Frisk Report Database](http://www.nyc.gov/html/nypd/html/analysis_and_planning/stop_question_and_frisk_report.shtml) and unzip it
- Import 2015_sqf_csv.csv into db as table named '2015stopfrisk'
- Import /svc/labels/2015labels_value.csv into db as table named '2015labels_value'
- Add a config.js and credentials.js to /common (see templates, use your own db host/database and credentials)
- **npm start**
- **grunt** in another window to watch for changes
- If running locally, visit localhost:8080 in your browser
