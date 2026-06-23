import json
import os
import base64
import uuid

import boto3


def handler(event: dict, context) -> dict:
    """Загрузка файла (base64) в S3, возвращает публичную ссылку"""
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    file_b64 = body.get('file')
    filename = (body.get('filename') or '').strip()

    if not file_b64 or not filename:
        return {'statusCode': 400, 'headers': cors_headers, 'body': json.dumps({'error': 'file and filename required'})}

    file_bytes = base64.b64decode(file_b64)
    safe_name = filename.replace('/', '_').replace('\\', '_')
    key = f"orders/{uuid.uuid4().hex}_{safe_name}"

    ext = filename.rsplit('.', 1)[-1].lower()
    ct_map = {'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png', 'webp': 'image/webp', 'gif': 'image/gif'}
    content_type = ct_map.get(ext, 'application/octet-stream')

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )
    s3.put_object(Bucket='files', Key=key, Body=file_bytes, ContentType=content_type)
    file_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"

    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps({'url': file_url})
    }
