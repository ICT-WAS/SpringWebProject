import json

# pip install pandas
# pip install sqlalchemy


# 정보  파일 경로
info_file = 'info.txt 파일 경로'

info = json.load(open(info_file, 'r', encoding='utf-8'))

api_key = info['data.go.kr_key'] # api 인증키

# MariaDB
username = info['username']  # MariaDB 사용자 이름
password = info['password']  # MariaDB 비밀번호
database = info['database']  # MariaDB 데이터베이스 이름
host = info['host']  # MariaDB 호스트 (보통 'localhost' 또는 IP 주소)
port = info['port']  # MariaDB 포트 (기본값: 3306)