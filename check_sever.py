import psutil
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import datetime

# CPU 및 메모리 사용량 상위 10개 프로세스 추출
def get_top_processes():
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
        processes.append(proc.info)

    # CPU 사용량과 메모리 사용량 상위 10개 정렬
    processes = sorted(processes, key=lambda p: (p['cpu_percent'], p['memory_percent']), reverse=True)
    top_10_processes = processes[:10]
    
    # 결과 형식화
    result = f"Top 10 processes by CPU and memory usage on {datetime.datetime.now()}:\n\n"
    result += "{:<8} {:<25} {:<10} {:<10}\n".format("PID", "Process", "CPU (%)", "Memory (%)")
    result += "-"*50 + "\n"
    
    for proc in top_10_processes:
        result += "{:<8} {:<25} {:<10} {:<10}\n".format(proc['pid'], proc['name'], proc['cpu_percent'], proc['memory_percent'])
    
    return result

# 이메일 전송 함수
def send_email(subject, body, to_email):
    from_email = "your_email@example.com"
    password = "your_password"

    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'plain'))

    # SMTP 서버 설정 (예: Gmail)
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(from_email, password)
    text = msg.as_string()
    server.sendmail(from_email, to_email, text)
    server.quit()

# 메인 함수
if __name__ == "__main__":
    processes_info = get_top_processes()
    send_email("Top 10 Processes CPU and Memory Usage", processes_info, "recipient_email@example.com")
