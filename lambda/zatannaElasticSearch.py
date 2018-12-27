import json
import boto3
import datetime
from elasticsearch import Elasticsearch, RequestsHttpConnection
import urllib
import requests
from requests_aws4auth import AWS4Auth


region = 'us-east-2'
service = 'es'
credentials = boto3.Session().get_credentials()
awsauth = AWS4Auth(credentials.access_key, credentials.secret_key,
                   region, service, session_token=credentials.token)

host = '<end-point>'
index = 'song'
doc_type = 'lambda-type'
url = host + '/' + index + '/' + doc_type
headers = {"Content-Type": "application/json"}

# Create the elastic search connection
es = Elasticsearch(
    hosts=[{'host': host, 'port': 443}],
    http_auth=awsauth,
    use_ssl=True,
    verify_certs=True,
    analyzer={
        "tokenizer": "standard",
        "filter": ["standard", "lowercase", "stop", "porter_stem"]},
    search_analyzer={
        "tokenizer": "standard",
        "filter": ["standard", "lowercase", "stop", "porter_stem"]},
    connection_class=RequestsHttpConnection)


def insert(document):
    res = es.index(index=index, doc_type=doc_type, body=document)
    print("inserted!")
    return res


def search_song(q):
    res_search = es.search(index=index, doc_type=doc_type, body={
                           "query": {"match": {"sName": q}}})
    return res_search


def lambda_handler(event, context):
    print(event)

    # Create index
    #es.indices.create(index='song', ignore=400)

    # Delete index
    #es.indices.delete(index='songfinal', ignore=[400, 404])

    # list all indicies
    # print(es.indices.get_alias("*"))

    if 'action' in event:
        sID = event['key1']
        sName = event['key2']
        finalArtistObject = {"sID": sID, "sName": sName}
        response_artist = insert(finalArtistObject)
    else:
        query = event["queryStringParameters"]["query"]
        hits = search_song(query)
        getresponse = []
        for hit in hits['hits']['hits']:
            # print("see",hit['_source']['sName'])
            getresponse.append((hit['_source']))

        data = {
            "response": getresponse
        }
        response = {
            "isBase64Encoded": False,
            "statusCode": 200,
            "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            "body": json.dumps(getresponse)
        }

    return response
