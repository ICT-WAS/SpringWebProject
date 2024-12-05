import os

import pandas as pd

from sqlalchemy import create_engine
from sqlalchemy import text

import utility

# MariaDB에 연결하기 위한 연결 URL 설정
username = utility.username
password = utility.password
database = utility.database
host = utility.host
port = utility.port

# SQLAlchemy 엔진 생성
engine = create_engine(f'mysql+pymysql://{username}:{password}@{host}:{port}/{database}')

df = pd.read_csv('../APT 분양정보 주택형별 상세조회.csv')

with engine.connect() as conn:
    # PBLANC_NO 리스트를 SQL 쿼리로 전달하여 해당하는 house_id 값을 가져옵니다.
    result = conn.execute(text("""
        SELECT PBLANC_NO, house_id
        FROM house
        WHERE PBLANC_NO IN :pblanc_list
    """), {'pblanc_list': tuple(df['PBLANC_NO'].tolist())})

    # 결과를 DataFrame으로 변환
    house_data = pd.DataFrame(result.fetchall(), columns=['PBLANC_NO', 'house_id'])

# df에 house_id 컬럼을 추가하려면 PBLANC_NO를 기준으로 병합합니다.
df = df.merge(house_data, on='PBLANC_NO', how='left')
df = df.drop(columns=['HOUSE_MANAGE_NO', 'PBLANC_NO'])

with engine.connect() as conn:
    # 데이터베이스에서 존재하는 house_id 값을 가져옵니다
    result = conn.execute(text("SELECT house_id FROM detail WHERE house_id IN :house_id_list"),
                          {'house_id_list': tuple(df['house_id'].tolist())})

    # result를 딕셔너리 형식으로 변환하여 'house_id' 값만 추출합니다
    existing_pblanc_nos = {row['house_id'] for row in result.mappings()}

# 3. 데이터프레임에서 이미 존재하는 house_id 값 필터링
df_filtered = df[~df['house_id'].isin(existing_pblanc_nos)]

# 4. 필터링된 데이터만 데이터베이스에 삽입
if not df_filtered.empty:
    df_filtered.to_sql('detail', con=engine, if_exists='append', index=False)
    print("detail: APT 분양정보 주택형별 상세조회.csv 파일의 정보가 데이터 베이스에 정보가 입력되었습니다.")
else:
    print("detail: APT 분양정보 주택형별 상세조회.csv 파일의 신규 데이터가 없어 데이터를 저장하지 않았습니다.")



# =====================================================================================




df = pd.read_csv('../APT 무순위 및 잔여세대 분양정보 주택형별 상세조회.csv')

with engine.connect() as conn:
    # PBLANC_NO 리스트를 SQL 쿼리로 전달하여 해당하는 house_id 값을 가져옵니다.
    result = conn.execute(text("""
        SELECT PBLANC_NO, house_id
        FROM house
        WHERE PBLANC_NO IN :pblanc_list
    """), {'pblanc_list': tuple(df['PBLANC_NO'].tolist())})

    # 결과를 DataFrame으로 변환
    house_data = pd.DataFrame(result.fetchall(), columns=['PBLANC_NO', 'house_id'])

# df에 house_id 컬럼을 추가하려면 PBLANC_NO를 기준으로 병합합니다.
df = df.merge(house_data, on='PBLANC_NO', how='left')
df = df.drop(columns=['HOUSE_MANAGE_NO', 'PBLANC_NO'])

with engine.connect() as conn:
    # 데이터베이스에서 존재하는 house_id 값을 가져옵니다
    result = conn.execute(text("SELECT house_id FROM detail WHERE house_id IN :house_id_list"),
                          {'house_id_list': tuple(df['house_id'].tolist())})

    # result를 딕셔너리 형식으로 변환하여 'house_id' 값만 추출합니다
    existing_pblanc_nos = {row['house_id'] for row in result.mappings()}

# 3. 데이터프레임에서 이미 존재하는 house_id 값 필터링
df_filtered = df[~df['house_id'].isin(existing_pblanc_nos)]

# 4. 필터링된 데이터만 데이터베이스에 삽입
if not df_filtered.empty:
    df_filtered.to_sql('detail', con=engine, if_exists='append', index=False)
    print("detail: APT 무순위 및 잔여세대 분양정보 주택형별 상세조회.csv 파일의 정보가 데이터 베이스에 정보가 입력되었습니다.")
else:
    print("detail: APT 무순위 및 잔여세대 분양정보 주택형별 상세조회.csv 파일의 신규 데이터가 없어 데이터를 저장하지 않았습니다.")