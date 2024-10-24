import psutil
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib
import dotenv
import os
import time

dotenv.load_dotenv()

EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PWD = os.getenv('EMAIL_HOST_PWD')

# 프로세스 목록 초기화
processes = []

# 프로세스의 초기 CPU 사용량 측정
for p in psutil.process_iter(['pid', 'name']):
    try:
        p.cpu_percent(interval=None)  # 초기화
        processes.append(p)
    except (psutil.NoSuchProcess, psutil.AccessDenied):
        continue

# 잠시 대기
time.sleep(1)

# CPU 사용량 다시 측정
for p in processes:
    try:
        cpu_usage = p.cpu_percent(interval=None)
        # print(f"Process ID: {p.info['pid']}, Name: {p.info['name']}, CPU Usage: {cpu_usage}%")
    except (psutil.NoSuchProcess, psutil.AccessDenied):
        continue

# 이메일 내용 생성
body = '\n'.join([str(proc) for proc in processes])

# 이메일 설정
msg = MIMEMultipart()
msg['From'] = EMAIL_HOST_USER
msg['To'] = 'dmlgus1922@polarisai.co.kr'
msg['Subject'] = 'Top 10 Processes by CPU and Memory Usage'
msg.attach(MIMEText(body, 'plain'))

# SMTP 서버 설정 및 이메일 보내기
try:
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(EMAIL_HOST_USER, EMAIL_HOST_PWD)
    text = msg.as_string()
    server.sendmail(EMAIL_HOST_USER, 'dmlgus1922@polarisai.co.kr', text)
    server.quit()
    print("이메일이 성공적으로 보내졌습니다.")
except Exception as e:
    print(f"이메일을 보내는 중 오류가 발생했습니다: {e}")
