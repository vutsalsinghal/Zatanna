import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('zatannadb')


def lambda_handler(event, context):
    retString = 'No DB Update!'

    if 'action' in event:
        '''
        if event['action'] == "SongUpload":
            aID = int(event['aID'])
            sID = int(event['sID'])
            getRow = table.get_item(Key={"entity": "Artist", "ID": aID})

            if 'Item' in getRow:
                if 'songsUploaded' in getRow['Item']:
                    if sID not in getRow['Item']['songsUploaded']:
                        getRow['Item']['songsUploaded'].append(sID)
                else:
                    getRow['Item']['songsUploaded'] = [sID]
                table.put_item(Item=getRow['Item'])
            else:
                table.put_item(Item={"entity": "Artist", "ID": aID, 'songsUploaded': [sID]})

            retString = 'SongID ' + str(sID) + ' uploaded successfully by ArtistID ' + str(aID)
        '''

        if event['action'] == "SongPurchase":
            uID = int(event['uID'])
            sID = int(event['sID'])
            genre = int(event['genre'])
            getRow = table.get_item(Key={"entity": "User", "ID": uID})

            if 'Item' in getRow:
                if 'purchasedSongs' in getRow['Item']:
                    if [sID, genre] not in getRow['Item']['purchasedSongs']:
                        getRow['Item']['purchasedSongs'].append([sID, genre])
                else:
                    getRow['Item']['purchasedSongs'] = [[sID, genre]]
                table.put_item(Item=getRow['Item'])
            else:
                table.put_item(
                    Item={"entity": "User", "ID": uID, 'purchasedSongs': [[sID, genre]]})

            retString = 'SongID ' + \
                str(sID) + ' purchased successfully by UserID ' + str(uID)

        elif event['action'] == "SongDistribution":
            uID = int(event['uID'])
            sID = int(event['sID'])
            genre = int(event['genre'])
            getRow = table.get_item(Key={"entity": "User", "ID": uID})
            print(getRow)

            if 'Item' in getRow:
                if 'SongDistribution' in getRow['Item']:
                    if str(sID) in getRow['Item']['SongDistribution']:
                        v = int(getRow['Item']
                                ['SongDistribution'][str(sID)][0])
                        getRow['Item']['SongDistribution'][str(sID)] = [
                            str(v+1), str(genre)]
                    else:
                        getRow['Item']['SongDistribution'][str(sID)] = [
                            "1", str(genre)]
                else:
                    getRow['Item']['SongDistribution'] = {
                        str(sID): ["1", str(genre)]}
                table.put_item(Item=getRow['Item'])
            else:
                table.put_item(Item={"entity": "User", "ID": uID, 'SongDistribution': {
                               str(sID): ["1", str(genre)]}})

            retString = 'SongID ' + \
                str(sID) + ' distribution of UserID ' + \
                str(uID) + ' updated successfully!'

    if 'retrieve' in event:
        if event['retrieve'] == 'SongPurchase':
            uID = int(event['uID'])
            sID = int(event['sID'])
            genre = int(event['genre'])

            getRow = table.get_item(Key={"entity": "User", "ID": uID})
            if 'Item' in getRow and 'purchasedSongs' in getRow['Item']:
                oldList = getRow['Item']['purchasedSongs']
                if [sID, genre] in oldList:
                    retString = True
                else:
                    retString = False
            else:
                retString = False

        if event['retrieve'] == 'SongDistribution':
            uID = int(event['uID'])
            sID = int(event['sID'])

            getRow = table.get_item(Key={"entity": "User", "ID": uID})
            if 'Item' in getRow and 'SongDistribution' in getRow['Item']:
                oldDict = getRow['Item']['SongDistribution']
                if str(sID) in oldDict:
                    retString = oldDict[str(sID)]
                else:
                    retString = False
            else:
                retString = False

    return {
        'statusCode': 200,
        'body': retString
    }
