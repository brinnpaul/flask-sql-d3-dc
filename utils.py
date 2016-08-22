import simplejson
class Jsonify():

    def __init__(self):
        self.q1 = self.jsonify_q1
        self.q2_dem = self.jsonify_q2_dem
        self.q2_conf = self.jsonify_q2_conf
        self.q3 = self.jsonify_q3

    def jsonify_q1(self, data):
        arr = []
        for row in data:
            r = {"country": self.rename(row[0]),
                 "quantity": row[1],
                 "trade_usd": row[2],
                 "date": row[3]}
            arr.append(r)
        return simplejson.dumps(arr, encoding="utf8")

    def jsonify_q2_conf(self, data):
        arr = []
        for row in data:
            r = {"conflict": row[0],
                 "income": row[1],
                 "country": row[2].decode("ISO-8859-1")}
            arr.append(r)
        return simplejson.dumps(arr, encoding="utf8")

    def jsonify_q2_dem(self, data):
        arr = []
        for row in data:
            r = {"dem_index": row[0],
                 "income": row[1],
                 "country": row[2].decode("ISO-8859-1")}
            arr.append(r)
        return simplejson.dumps(arr, encoding="utf8")

    def jsonify_q3(self, data):
        arr = []
        country = ''
        for row in data:
            r = { "country": row[1].title(),
                  "total_workers": row[2] if (self.isN(row[2])) else 0,
                  "female_workers": row[3]*(row[2]/100) if (self.isN(row[2]) and self.isN(row[3])) else 0,
                  "pop_2013": row[4] if(country != row[1]) else 0,
                  "pop_2014": row[5] if(country != row[1]) else 0,
                  "pop_2015": row[6] if(country != row[1]) else 0,
                  "pop_2016": row[7] if(country != row[1]) else 0,
                  "pop_2017": row[8] if(country != row[1]) else 0,
                  "ue_2013": row[9] if(country != row[1]) else 0,
                  "ue_2014": row[10] if(country != row[1]) else 0,
                  "ue_2015": row[11] if(country != row[1]) else 0,
                  "ue_2016": row[12] if(country != row[1]) else 0,
                  "ue_2017": row[13] if(country != row[1]) else 0}
            arr.append(r)
            country = row[1]
        return simplejson.dumps(arr, encoding="utf8")

    def isN(self, n):
        if (isinstance(n, (int, long, float, complex))):
            return True
        else:
            return False

    def rename(self, country):
        if (country == "USA"):
            return "United States"
        elif (country == "China, Hong Kong SAR"):
            return "China"
        elif (country == "China, Macao SAR"):
            return "China"
        elif (country == "Czech Rep."):
            return "Czech Republic"
        elif (country == "Dominican Rep."):
            return "Dominican Republic"
        elif (country == "Rep. of Korea"):
            return "South Korea"
        elif (country == "Russian Federation"):
            return "Russia"
        elif (country == "Serbia"):
            return "Republic of Serbia"
        elif (country == "Viet Nam"):
            return "Vietnam"
        else:
            return country.decode("ISO-8859-1")