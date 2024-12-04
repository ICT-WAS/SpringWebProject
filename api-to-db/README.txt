1.설정
    1) info.txt (json으로 변경 가능)에 api 인증키, 데이터베이스 정보를 입력
    2) utility.py에서 info.txt의 경로를 설정

2. 데이터 수집
    1) getAPT.py를 실행
    2) getAPTDetail.py를 실행

3. 데이터베이스 저장
    1) APT 분양정보 insertDatabase.py를 실행
    2) APT 및 무순위 및 잔여세대 주택형별 insertDatabase.py를 실행
    3) 무순위 및 잔여세대 분양정보 insertDatabase.py를 실행

4. 데이터 업데이트 ( 필요에 따라 자동화 )
    1) api 폴더 내 *.py를 실행
    2) database 폴더 내 *.py를 실행