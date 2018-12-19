import pymysql
import sys
import boto3
import json


def lambda_handler(event, context):

    conn = pymysql.connect("", user="", passwd="", db="", connect_timeout=5)
    retString = False

    if 'action' in event:
        if event['action'] == 'addArtist':
            aID = event['aID']
            uID = event['uID']
            aName = event['aName']
            aAddress = event['aAddress']

            with conn.cursor() as cur:
                cur.execute("""insert into Artist (aID, uID, aName, aAddress) values (%s, %s, "%s", "%s")""" % (
                    aID, uID, aName, aAddress))
                conn.commit()
                cur.close()

            retString = 'Artist ' + aName + ' added successfully!'
            print(retString)

        elif event['action'] == "addUser":
            uID = event['uID']
            uName = event['uName']

            with conn.cursor() as cur:
                cur.execute(
                    """insert into User (uID, uName) values (%s, "%s")""" % (uID, uName))
                conn.commit()
                cur.close()

            retString = 'User ' + uName + ' added successfully!'
            print(retString)

        elif event['action'] == 'addSong':

            sID = str(event['sID'])
            aID = str(event['aID'])
            sName = event['sName']
            sCost = event['sCost']
            sGenre = event['sGenre']
            sReleaseDate = event['sReleaseDate']

            with conn.cursor() as cur:
                #cur.execute("""insert into Song (sID, aID, sName, sCost, sGenre, sReleaseDate) values (%d, %d, "%s", "%s", %s, "%s")"""%(sID, aID, sName, sCost, sGenre, sReleaseDate))
                sql = 'insert into Song (sID, aID, sName, sCost, sGenre, sReleaseDate) values (%s, %s, %s, %s, %s, %s)'
                data = (sID, aID, sName, sCost, sGenre, sReleaseDate)
                cur.execute(sql, data)
                conn.commit()
                cur.close()

            retString = 'song' + sName + ' added successfully!'
            print(retString)

            payload = {'action': 'addSong'}
            payload['key1'] = sID
            payload['key2'] = sName

            lam = boto3.client('lambda')
            try:
                responseinvoke = lam.invoke(
                    FunctionName='zatannaElasticSearch', InvocationType='RequestResponse', Payload=json.dumps(payload))
            except Exception as e:
                raise e

    with conn.cursor() as cur:
        sql = 'select * from Artist'
        cur.execute(sql)
        conn.commit()
        cur.close()

    for i in cur:
        print(list(i))

    conn.close()
    return {
        "statusCode": 200,
        "body": retString
    }
