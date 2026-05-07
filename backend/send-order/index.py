import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправка заявки с сайта на почту DATAR3D@yandex.ru"""
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    name = body.get('name', '').strip()
    contact = body.get('contact', '').strip()
    print_type = body.get('print_type', '').strip()
    description = body.get('description', '').strip()

    if not name or not contact:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Укажите имя и контакт'})
        }

    smtp_user = os.environ['YANDEX_SMTP_USER']
    smtp_password = os.environ['YANDEX_SMTP_PASSWORD']
    recipient = 'DATAR3D@yandex.ru'

    print_type_label = {
        'photo': 'Фотополимерная',
        'extrusion': 'Экструзионная',
    }.get(print_type, print_type or 'Не указан')

    html_body = f"""
<h2>Новая заявка с сайта PRINT3D</h2>
<table style="border-collapse:collapse;width:100%;max-width:500px">
  <tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Имя</td><td style="padding:8px">{name}</td></tr>
  <tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Контакт</td><td style="padding:8px">{contact}</td></tr>
  <tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Тип печати</td><td style="padding:8px">{print_type_label}</td></tr>
  <tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Описание задачи</td><td style="padding:8px">{description or 'Не указано'}</td></tr>
</table>
"""

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новая заявка от {name}'
    msg['From'] = smtp_user
    msg['To'] = recipient
    msg.attach(MIMEText(html_body, 'html', 'utf-8'))

    with smtplib.SMTP_SSL('smtp.yandex.ru', 465) as server:
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, recipient, msg.as_string())

    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps({'ok': True})
    }
