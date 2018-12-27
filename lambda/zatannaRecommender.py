import os
import io
import boto3
import json
import csv
import random

# grab environment variables
ENDPOINT_NAME = os.environ['ENDPOINT_NAME']
runtime = boto3.client('runtime.sagemaker')
s3 = boto3.client('s3')

bucket = 'zatanna-sagemaker1'
key = 'sagemaker/test.csv'


def random_subset(iterator, K):
    result = []
    N = 0

    for item in iterator:
        N += 1
        if len(result) < 5:
            result.append(item)
        else:
            s = int(random.random() * N)
            if s < 5:
                result[s] = item

    return result


def lambda_handler(event, context):
    csvfile = s3.get_object(Bucket=bucket, Key=key)
    payload = csvfile["Body"].read().decode('utf-8')
    response = runtime.invoke_endpoint(
        EndpointName=ENDPOINT_NAME, ContentType='text/csv', Body=payload)

    result = json.loads(response['Body'].read().decode())
    for i in range(0, 20):
        result['predictions'][i]['sID'] = i+1

    f = filter(lambda x: x['score'] > 0.9, result['predictions'])
    f1 = random_subset(f, 5)
    return list(f1)
