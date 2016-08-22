# -- coding: utf8 --
import os
from flask import Flask
from flask import render_template
import MySQLdb
import urllib2
import decimal
import simplejson
from appmysql import SQLQuery
from queries import Simon
from utils import Jsonify

app = Flask(__name__)

# import db info
simon = Simon()
host = simon.dbinfo["host"]
user = simon.dbinfo["user"]
db = simon.dbinfo["db"]
passwd = simon.dbinfo["passwd"]

# mysql query helper class
sql = SQLQuery(user, db, passwd, host)

# helper class for converting msyql queries to json / formatting data
jsonify = Jsonify()

# backend routes
@app.route('/question1data')
def question1data():
    data = sql.makeQuery(simon.one)
    return jsonify.q1(data)

@app.route('/question2datadem')
def question2datadem():
    data = sql.makeQuery(simon.two_dem)
    return jsonify.q2_dem(data)

@app.route('/question2dataconf')
def question2dataconf():
    data = sql.makeQuery(simon.two_conf)
    return jsonify.q2_conf(data)

@app.route('/question3data')
def question3data():
    data = sql.makeQuery(simon.three)
    return jsonify.q3(data)

# frontend routes
@app.route("/")
def layout():
    return render_template("layout.html")

@app.route('/index')
def index():
    return render_template("question/index.html")

@app.route('/question1')
def question1():
    return render_template("question/question1.html")

@app.route('/question2')
def question2():
    return render_template("question/question2.html")

@app.route('/question3')
def question3():
    return render_template("question/question3.html")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)