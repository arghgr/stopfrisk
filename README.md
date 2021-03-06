## Notes
- 2016/09/22:
- This is a work in progress.
- Current functionality is only for the year 2015.
- [D3.js](https://d3js.org/) generates all graphs as SVGs on the server side so you can right-click and 'Save As' in the browser.
- To-dos include:
    - More efficient label importing (currently importing them from both an in-repo .csv and the db)
    - Label popups on hover for easier reading
    - Better organization of data
    - Filter by text matching (for fields without set values)
    - Show other years, graphing across years

---

## How to run locally
- Make sure you have [MySQL](https://www.mysql.com/) installed
    - https://dev.mysql.com/doc/refman/5.7/en/postinstallation.html
    - https://dev.mysql.com/doc/refman/5.7/en/default-privileges.html
    - Assuming you've installed it locally (you'll be given a temporary password):
    - **cd /usr/local/mysql**
    - **bin/mysql -u root -p**
    - [enter temporary password at prompt]
    - **ALTER USER 'root'@'localhost' IDENTIFIED BY '[new password]';**
    - **exit**
    - (After setting these basics up, I usually use a GUI like [Sequel Pro](http://www.sequelpro.com/) or [MySQL Workbench](https://www.mysql.com/products/workbench/) to import tables and run commands)
- Create a MySQL database (config template uses localhost and a db named 'stopfrisk')
- Get 2015 csv zip archive from [NYPD Stop, Question and Frisk Report Database](http://www.nyc.gov/html/nypd/html/analysis_and_planning/stop_question_and_frisk_report.shtml) and unzip it
- Import 2015_sqf_csv.csv into db as table named '2015stopfrisk'
- Import /svc/labels/2015labels_value.csv into db as table named '2015labels_value'
- Add a .env file with config vars to the main directory
    - (see .env.template, use your own database and credentials)
- Set IS_PRODUCTION to false: **export IS_PRODUCTION=false**
    - (if true, the app will look for config vars in the real shell instead of the .env file)
- Make sure you've got [Node.js](https://nodejs.org/en/) installed (I'm using v5.11.0)
- In terminal, go to the root level of this directory (**cd ~/[path to repo]/nypd-stopfrisk**)
- **npm install**
- **npm start** (if you didn't permanently export IS_PRODUCTION, set it now: **IS_PRODUCTION=false npm start**)
- **grunt** in another window to watch for changes
- If running locally, visit localhost:8080 in your browser
