import MySQLdb

class SQLQuery():
    def __init__(self, user, db, passwd, host):
        self.user = user
        self.db = db
        self.passwd = passwd
        self.host = host
        self.makeQuery = self.makeQuery

    def makeQuery(self, query):
        connection = MySQLdb.connect(user=self.user, db=self.db, passwd=self.passwd, host=self.host)
        cursor = connection.cursor()
        cursor.execute(query)
        result = cursor.fetchall()
        connection.close()
        return result