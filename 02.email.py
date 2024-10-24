from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib
import dotenv
import os

dotenv.load_dotenv()

EMAIL_HOST=os.getenv('EMAIL_HOST')
EMAIL_PORT=os.getenv('EMAIL_PORT')
EMAIL_HOST_USER=os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PWD=os.getenv('EMAIL_HOST_PWD')


msg = MIMEMultipart()

# ... existing code ...

# 이메일 설정
msg['From'] = EMAIL_HOST_USER
msg['To'] = 'dmlgus1922@polarisai.co.kr'
msg['Subject'] = 'test'

# 이메일 내용
body = 'test'
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

# ... existing code ...