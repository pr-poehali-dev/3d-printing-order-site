import json
import os
import re
import base64
import uuid
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr

import boto3

EMAIL_RE = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')


def handler(event: dict, context) -> dict:
    """Отправка заявки и загрузка файлов для DATAR3D@yandex.ru"""
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    action = body.get('action', 'send')

    # --- Загрузка одного файла ---
    if action == 'upload':
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
        return {'statusCode': 200, 'headers': cors_headers, 'body': json.dumps({'url': file_url})}

    # --- Отправка заявки ---
    name = body.get('name', '').strip()
    contact = body.get('contact', '').strip()
    print_type = body.get('print_type', '').strip()
    description = body.get('description', '').strip()
    delivery = body.get('delivery', '').strip()
    calc_type = body.get('calc_type', '')
    calc_material = body.get('calc_material', '')
    calc_volume = body.get('calc_volume', 0)
    calc_quantity = body.get('calc_quantity', 1)
    calc_price_per_piece = body.get('calc_price_per_piece', 0)
    calc_total_price = body.get('calc_total_price', 0)
    model_url = (body.get('model_url') or '').strip()
    model_filename = (body.get('model_filename') or '').strip()
    photo_url = (body.get('photo_url') or '').strip()
    photo_filename = (body.get('photo_filename') or '').strip()

    if not name or not contact:
        return {'statusCode': 400, 'headers': cors_headers, 'body': json.dumps({'error': 'Укажите имя и контакт'})}

    smtp_user = os.environ['YANDEX_SMTP_USER']
    smtp_password = os.environ['YANDEX_SMTP_PASSWORD']
    recipient = 'DATAR3D@yandex.ru'

    print_type_label = {'photo': 'Фотополимерная', 'extrusion': 'Экструзионная'}.get(print_type, print_type or 'Не указан')

    calc_block = ''
    if calc_material and calc_volume:
        calc_type_label = {'photo': 'Фотополимерная', 'extrusion': 'Экструзионная'}.get(calc_type, calc_type)
        calc_block = f"""
<tr><td colspan="2" style="padding:8px;font-weight:bold;background:#e8f0fe;color:#1a56db">Расчёт из калькулятора</td></tr>
<tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Технология</td><td style="padding:8px">{calc_type_label}</td></tr>
<tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Материал</td><td style="padding:8px">{calc_material}</td></tr>
<tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Объём</td><td style="padding:8px">{calc_volume} см³</td></tr>
<tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Количество</td><td style="padding:8px">{calc_quantity} шт.</td></tr>
<tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Цена за штуку</td><td style="padding:8px">{calc_price_per_piece} ₽</td></tr>
<tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Итого</td><td style="padding:8px;font-weight:bold;color:#1a56db">{calc_total_price} ₽</td></tr>
"""

    file_block = ''
    if model_url:
        file_block = f'<tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">3D-модель</td><td style="padding:8px"><a href="{model_url}">{model_filename or "Скачать"}</a></td></tr>'

    photo_block = ''
    if photo_url:
        photo_block = f'''<tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Фото</td><td style="padding:8px"><a href="{photo_url}">{photo_filename or "Открыть"}</a><br><img src="{photo_url}" style="max-width:300px;max-height:300px;margin-top:6px;border-radius:6px" /></td></tr>'''

    html_body = f"""
<h2>Новая заявка с сайта PRINT3D</h2>
<table style="border-collapse:collapse;width:100%;max-width:500px">
  <tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Имя</td><td style="padding:8px">{name}</td></tr>
  <tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Контакт</td><td style="padding:8px">{contact}</td></tr>
  <tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Тип печати</td><td style="padding:8px">{print_type_label}</td></tr>
  <tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Доставка</td><td style="padding:8px">{delivery or 'Не указано'}</td></tr>
  <tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Описание задачи</td><td style="padding:8px">{description or 'Не указано'}</td></tr>
  {file_block}
  {photo_block}
  {calc_block}
</table>
"""

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новая заявка от {name}'
    msg['From'] = smtp_user
    msg['To'] = recipient
    if EMAIL_RE.match(contact):
        msg['Reply-To'] = formataddr((name, contact))
    msg.attach(MIMEText(html_body, 'html', 'utf-8'))

    with smtplib.SMTP_SSL('smtp.yandex.ru', 465) as server:
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, recipient, msg.as_string())

    return {'statusCode': 200, 'headers': cors_headers, 'body': json.dumps({'ok': True})}