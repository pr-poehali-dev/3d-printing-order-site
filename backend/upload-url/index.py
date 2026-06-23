import json
import os
import uuid

import boto3


def handler(event: dict, context) -> dict:
    """Выдаёт временную ссылку (presigned URL) для прямой загрузки 3D-модели в облако"""
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    filename = (body.get('filename') or '').strip()

    if not filename:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Не указано имя файла'})
        }

    safe_name = filename.replace('/', '_').replace('\\', '_')
    key = f"orders/{uuid.uuid4().hex}_{safe_name}"

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )

    upload_url = s3.generate_presigned_url(
        'put_object',
        Params={
            'Bucket': 'files',
            'Key': key,
        },
        ExpiresIn=3600,
    )

    file_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"

    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps({
            'upload_url': upload_url,
            'file_url': file_url,
        })
    }