import json
import os
import base64
import urllib.request
import urllib.error


def handler(event: dict, context) -> dict:
    """
    Анализирует изображение с габаритами изделия и возвращает длину, ширину, высоту и рассчитанный объём.
    """
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')
    image_base64 = body.get('image')

    if not image_base64:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Изображение не передано'})
        }

    api_key = os.environ.get('PROXYAPI_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'API ключ не настроен'})
        }

    prompt = """Ты эксперт по анализу чертежей и фотографий изделий. 
На изображении показано изделие с указанными габаритами (размерами).
Найди размеры: длину (L), ширину (W) и высоту (H).
Если единицы измерения не указаны, предположи миллиметры.
Рассчитай объём как L × W × H, переведи в кубические сантиметры (делить на 1000 если мм).

Ответь ТОЛЬКО в формате JSON без пояснений:
{"length_mm": число, "width_mm": число, "height_mm": число, "volume_cm3": число, "unit": "mm", "confidence": "high/medium/low", "note": "краткое пояснение"}

Если размеры невозможно определить, верни:
{"error": "Не удалось распознать габариты на изображении"}"""

    payload = {
        "model": "gpt-4o",
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{image_base64}",
                            "detail": "high"
                        }
                    }
                ]
            }
        ],
        "max_tokens": 300
    }

    req = urllib.request.Request(
        'https://api.proxyapi.ru/openai/v1/chat/completions',
        data=json.dumps(payload).encode('utf-8'),
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        },
        method='POST'
    )

    with urllib.request.urlopen(req, timeout=25) as resp:
        result = json.loads(resp.read())

    content = result['choices'][0]['message']['content'].strip()
    if content.startswith('```'):
        content = content.split('```')[1]
        if content.startswith('json'):
            content = content[4:]

    parsed = json.loads(content.strip())

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(parsed)
    }