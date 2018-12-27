import json
import urllib
import boto3
import time

client = boto3.client('s3')


def lambda_handler(event, context):
    if event['action'] == 'deleteS3File':
        bucket = event['bucket']
        key = urllib.parse.unquote_plus(event['key'])
        try:
            response = client.delete_object(Bucket=bucket, Key=key)
            body = key.split('/')[1] + ' deleted successfully!'
        except Exception as e:
            body = e
            raise e

    return {
        "statusCode": 200,
        "body": body
    }
