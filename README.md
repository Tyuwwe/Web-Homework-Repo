# Web-Homework-Repo R-E-Dine

## Restaurant Preorder & Takeaway System

Built with Node.js v20.9.0 & Electron 27.1.0 & Python Flask & PostgreSQL

Version 1.6.0 r2

## [R-E-Dine Electron Client](./R-E-Dine)

License: GPLv3 | [Original Repo](https://github.com/1324151534/R-E-Dine)

#### Usage:

1. Clone
2. Install [Node.js](https://nodejs.org/en)
3. Install electron

   ```bash
   cd ./R-E-Dine/
   npm install --save-dev electron
   ```
4. Start

   ```bash
   npm start
   ```

## [R-E-Dine Server](./R-E-Dine-Server)

License: GPLv3 | [Original Repo](https://github.com/1324151534/R-E-Dine-Server)

#### Usage:

1. Clone
2. Install [Python](https://www.python.org/) and [PostgreSQL](https://www.postgresql.org/)
3. Install Python Requirements

   ```bash
   pip install flask, flask_cors, flask_sqlalchemy, psycopg2
   ```
4. Create PostgreSQL Server

   ```
   1. open pgAdmin
   2. create server "R-E-Dine"
   ```
5. If you need example data, see [here](./R-E-Dine-Server/README.md). Use query tools to insert them.
6. If you want to register dining manager or delivery account, please insert manually in pgAdmin query tools.

   ```
   User Table
   Role:
   1. normal user: customer
   2. dining manager: admin
   3. delivery man: delivery

   Email & Name:
   Any

   User ID:
   Auto Increase

   Password:
   MD5 encrypted password
   For example: "202cb962ac59075b964b07152d234b70" means "123"
   ```
7. Start Server

   ```bash
   python ./R-E-Dine-Server/app.py
   ```
