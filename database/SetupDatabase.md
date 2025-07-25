# Database Setup

## Create database in PostgreSQL:
1. Go to your "pgadmin4" app and connect to your servers
2. Right click on PostgreSQL
3. Click "Create"
4. Click "Database"
5. Enter a name for your database (note: in this project we used the name "machine_failure_db")
6. Click "Save"

## Create table in PostgreSQL:
Once created go to your database and:
1. Right click your database
2. Select "Create Script"
3. Delete any existing code in the script
4. Enter the following SQL code:
```sql
CREATE TABLE Machines (
  machine_id INT PRIMARY KEY,
  name VARCHAR(100),
  location VARCHAR(100),
  last_maintenance DATE,
  temperature FLOAT,
  vibration FLOAT,
  pressure INT,
  oil_level INT,
  error_code VARCHAR(20)
);
```
5. Click "Execute" or press F5
6. in messages it should say "
CREATE TABLE
Query returned successfully in * msec."

## Implement test querys after creating the database
1. Delete any existing code in the script again to create another query
2. Go to "TestQuery.txt" copy and paste the code from there (That code will insert test data into the table)
3. Execute the query by clicking "Execute" or press F5
4. in messages it should say "
INSERT 0 30
Query returned successfully in * msec."