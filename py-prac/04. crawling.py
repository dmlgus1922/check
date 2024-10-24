from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import pandas as pd
import time

# 크롬 옵션 설정
chrome_options = Options()
chrome_options.add_argument("--headless")  # 브라우저 창을 띄우지 않음
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")

# 웹드라이버 설정
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

# 검색할 키워드 설정
search_keyword = "파이썬"
url = f"https://search.naver.com/search.naver?where=news&query={search_keyword}"

# 페이지 열기
driver.get(url)
time.sleep(2)  # 페이지 로딩 대기

# 뉴스 데이터 저장 리스트
news_data = []

# 뉴스 기사 링크 추출
news_links = driver.find_elements(By.CSS_SELECTOR, 'a.news_tit')

for link in news_links:
    # 각 뉴스 페이지로 이동
    link.click()
    time.sleep(2)  # 페이지 로딩 대기

    # 새 창으로 전환
    driver.switch_to.window(driver.window_handles[-1])

    # 제목과 내용 추출
    try:
        title = driver.find_element(By.CSS_SELECTOR, 'h2').text
        content = driver.find_element(By.CSS_SELECTOR, 'div#articleBodyContents').text
        news_data.append({'Title': title, 'Content': content})
    except Exception as e:
        print(f"데이터 추출 중 오류 발생: {e}")

    # 현재 창 닫기
    driver.close()

    # 원래 창으로 전환
    driver.switch_to.window(driver.window_handles[0])

# 데이터프레임 생성
df = pd.DataFrame(news_data)

# 엑셀 파일로 저장
df.to_excel('news_data.xlsx', index=False)

# 드라이버 종료
driver.quit()
