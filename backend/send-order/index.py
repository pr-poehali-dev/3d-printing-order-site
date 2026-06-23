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
    calc_type = body.get('calc_type', '')
    calc_material = body.get('calc_material', '')
    calc_volume = body.get('calc_volume', 0)
    calc_quantity = body.get('calc_quantity', 1)
    calc_price_per_piece = body.get('calc_price_per_piece', 0)
    calc_total_price = body.get('calc_total_price', 0)
    model_url = (body.get('model_url') or '').strip()
    model_filename = (body.get('model_filename') or '').strip()

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
        label = model_filename or 'Скачать модель'
        file_block = f'<tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">3D-модель</td><td style="padding:8px"><a href="{model_url}">{label}</a></td></tr>'

    html_body = f"""
<h2>Новая заявка с сайта PRINT3D</h2>
<table style="border-collapse:collapse;width:100%;max-width:500px">
  <tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Имя</td><td style="padding:8px">{name}</td></tr>
  <tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Контакт</td><td style="padding:8px">{contact}</td></tr>
  <tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Тип печати</td><td style="padding:8px">{print_type_label}</td></tr>
  <tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Описание задачи</td><td style="padding:8px">{description or 'Не указано'}</td></tr>
  {file_block}
  {calc_block}
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