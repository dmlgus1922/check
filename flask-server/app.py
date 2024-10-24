# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import bcrypt
from dotenv import load_dotenv
import os
import jwt  # 추가
from datetime import datetime, timedelta  # 추가
from functools import wraps

load_dotenv()

app = Flask(__name__)
CORS(app)
SECRET_KEY = os.getenv('SECRET_KEY', 'your_default_secret_key')
# MySQL 연결 설정
# app.py 내에 추가


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # 헤더에서 토큰 가져오기
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'error': '토큰이 제공되지 않았습니다.'}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            current_user_id = data['user_id']
            # 사용자 ID를 kwargs에 추가
            kwargs['current_user_id'] = current_user_id
        except jwt.ExpiredSignatureError:
            return jsonify({'error': '토큰이 만료되었습니다.'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': '유효하지 않은 토큰입니다.'}), 401

        return f(*args, **kwargs)

    return decorated


def get_db_connection():
    return pymysql.connect(
        host=os.getenv('MYSQL_HOST', 'localhost'),
        user=os.getenv('MYSQL_USER', 'event_user'),
        password=os.getenv('MYSQL_PASSWORD', 'your_mysql_password'),
        database=os.getenv('MYSQL_DB', 'local_events'),
        cursorclass=pymysql.cursors.DictCursor,
        ssl={'ssl': {'check_hostname': False}}  # SSL 검증 비활성화
    )



@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # 입력값 검증
        if not email or not password:
            return jsonify({'error': '이메일과 비밀번호를 모두 입력해주세요.'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # 이메일 중복 확인
        cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
        existing_user = cursor.fetchone()

        if existing_user:
            cursor.close()
            conn.close()
            return jsonify({'error': '이미 가입된 이메일입니다.'}), 400

        # 비밀번호 해싱
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # 사용자 정보 저장
        cursor.execute('INSERT INTO users (email, password) VALUES (%s, %s)', (email, hashed_password))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({'success': True}), 201
    
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': '서버 오류가 발생했습니다.'}), 500


@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # 입력값 검증
        if not email or not password:
            return jsonify({'error': '이메일과 비밀번호를 모두 입력해주세요.'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # 사용자 정보 조회
        cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
        user = cursor.fetchone()

        cursor.close()
        conn.close()

        if user:
            # 비밀번호 검증
            if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
                # JWT 토큰 생성
                payload = {
                    'user_id': user['id'],
                    'exp': datetime.utcnow() + timedelta(hours=1)  # 토큰 만료 시간 설정 (예: 1시간)
                }
                token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

                return jsonify({'token': token}), 200
            else:
                return jsonify({'error': '비밀번호가 일치하지 않습니다.'}), 401
        else:
            return jsonify({'error': '존재하지 않는 이메일입니다.'}), 401

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': '서버 오류가 발생했습니다.'}), 500


@app.route('/api/events', methods=['POST'])
@token_required
def create_event(current_user_id):
    try:
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')
        event_date = data.get('date')

        # 입력값 검증
        if not title or not event_date:
            return jsonify({'error': '제목과 날짜는 필수 입력 사항입니다.'}), 400

        # 날짜 형식 검증
        try:
            event_date_obj = datetime.strptime(event_date, '%Y-%m-%d')
        except ValueError:
            return jsonify({'error': '날짜 형식이 올바르지 않습니다. YYYY-MM-DD 형식이어야 합니다.'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # 이벤트 정보 저장
        cursor.execute('INSERT INTO events (user_id, title, description, event_date) VALUES (%s, %s, %s, %s)',
                       (current_user_id, title, description, event_date))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({'success': True}), 201

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': '서버 오류가 발생했습니다.'}), 500
    

@app.route('/api/events', methods=['GET'])
def get_events():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # 이벤트와 사용자 정보를 JOIN하여 가져오기
        cursor.execute('''
            SELECT events.id, events.title, events.description, events.event_date, events.created_at, users.email AS user_email
            FROM events
            JOIN users ON events.user_id = users.id
            ORDER BY events.created_at DESC
        ''')
        events = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(events), 200

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': '서버 오류가 발생했습니다.'}), 500

@app.route('/api/events/<int:event_id>', methods=['GET'])
def get_event_detail(event_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # 이벤트와 사용자 정보를 JOIN하여 가져오기
        cursor.execute('''
            SELECT events.id, events.title, events.description, events.event_date, events.created_at, users.email AS user_email
            FROM events
            JOIN users ON events.user_id = users.id
            WHERE events.id = %s
        ''', (event_id,))
        event = cursor.fetchone()

        cursor.close()
        conn.close()

        if event:
            return jsonify(event), 200
        else:
            return jsonify({'error': '해당 이벤트를 찾을 수 없습니다.'}), 404

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': '서버 오류가 발생했습니다.'}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
