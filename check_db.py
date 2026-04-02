import sqlite3

conn = sqlite3.connect("travel_planner.db")
cursor = conn.cursor()

cursor.execute("PRAGMA table_info(user);")
columns = cursor.fetchall()

print("Columns in 'user' table:")
for col in columns:
    print(col[1])

conn.close()
