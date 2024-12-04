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

df = pd.read_csv('../APT 분양정보 상세조회.csv')

# 1. 필요한 칼럼만 선택하여 새로운 데이터프레임 생성
columns_to_keep = ['HOUSE_MANAGE_NO',
                   'PBLANC_NO',
                   'HOUSE_NM',
                   'HOUSE_SECD',
                   'HOUSE_SECD_NM',
                   'HSSPLY_ZIP',
                   'HSSPLY_ADRES',
                   'TOT_SUPLY_HSHLDCO',
                   'RCRIT_PBLANC_DE',
                   'PRZWNER_PRESNATN_DE',
                   'CNTRCT_CNCLS_BGNDE',
                   'CNTRCT_CNCLS_ENDDE',
                   'HMPG_ADRES',
                   'BSNS_MBY_NM',
                   'MDHS_TELNO',
                   'MVN_PREARNGE_YM',
                   'PBLANC_URL']

# df에서 필요한 칼럼만 선택
df = df[columns_to_keep]

df['RCRIT_PBLANC_DE'] = pd.to_datetime(df['RCRIT_PBLANC_DE'])
df['PRZWNER_PRESNATN_DE'] = pd.to_datetime(df['PRZWNER_PRESNATN_DE'])
df['CNTRCT_CNCLS_BGNDE'] = pd.to_datetime(df['CNTRCT_CNCLS_BGNDE'])
df['CNTRCT_CNCLS_ENDDE'] = pd.to_datetime(df['CNTRCT_CNCLS_ENDDE'])
df['HOUSE_SECD'] = df['HOUSE_SECD'].replace(1, '01')
df['HSSPLY_ZIP'] = df['HSSPLY_ZIP'].apply(lambda x: str(x).zfill(5))

# 2. 이미 존재하는 PBLANC_NO 값 확인
with engine.connect() as conn:
    # 데이터베이스에서 존재하는 PBLANC_NO 값을 가져옵니다
    result = conn.execute(text("SELECT PBLANC_NO FROM house WHERE PBLANC_NO IN :pblanc_list"),
                          {'pblanc_list': tuple(df['PBLANC_NO'].tolist())})

    # result를 딕셔너리 형식으로 변환하여 'PBLANC_NO' 값만 추출합니다
    existing_pblanc_nos = {row['PBLANC_NO'] for row in result.mappings()}

# 3. 데이터프레임에서 이미 존재하는 PBLANC_NO 값 필터링
df_filtered = df[~df['PBLANC_NO'].isin(existing_pblanc_nos)]

# 4. 필터링된 데이터만 데이터베이스에 삽입
if not df_filtered.empty:
    df_filtered.to_sql('house', con=engine, if_exists='append', index=False)
    print("house: 데이터 베이스에 정보가 입력되었습니다.")
else:
    print("house: 신규 데이터가 없어 데이터를 저장하지 않았습니다.")

# ==========================================================================

df = pd.read_csv('../APT 분양정보 상세조회.csv')


# 01. 필요한 칼럼만 선택하여 새로운 데이터프레임 생성
columns_to_keep = ['PBLANC_NO',
                   'HOUSE_DTL_SECD',
                   'HOUSE_DTL_SECD_NM',
                   'RENT_SECD',
                   'RENT_SECD_NM',
                   'SUBSCRPT_AREA_CODE',
                   'SUBSCRPT_AREA_CODE_NM',
                   'RCEPT_BGNDE',
                   'RCEPT_ENDDE',
                   'SPSPLY_RCEPT_BGNDE',
                   'SPSPLY_RCEPT_ENDDE',
                   'GNRL_RNK1_CRSPAREA_RCPTDE',
                   'GNRL_RNK1_CRSPAREA_ENDDE',
                   'GNRL_RNK1_ETC_GG_RCPTDE',
                   'GNRL_RNK1_ETC_GG_ENDDE',
                   'GNRL_RNK1_ETC_AREA_RCPTDE',
                   'GNRL_RNK1_ETC_AREA_ENDDE',
                   'GNRL_RNK2_CRSPAREA_RCPTDE',
                   'GNRL_RNK2_CRSPAREA_ENDDE',
                   'GNRL_RNK2_ETC_GG_RCPTDE',
                   'GNRL_RNK2_ETC_GG_ENDDE',
                   'GNRL_RNK2_ETC_AREA_RCPTDE',
                   'GNRL_RNK2_ETC_AREA_ENDDE',
                   'CNSTRCT_ENTRPS_NM',
                   'SPECLT_RDN_EARTH_AT',
                   'MDAT_TRGET_AREA_SECD',
                   'PARCPRC_ULS_AT',
                   'IMPRMN_BSNS_AT',
                   'PUBLIC_HOUSE_EARTH_AT',
                   'LRSCL_BLDLND_AT',
                   'NPLN_PRVOPR_PUBLIC_HOUSE_AT',
                   'PUBLIC_HOUSE_SPCLW_APPLC_AT']

# df에서 필요한 칼럼만 선택
df = df[columns_to_keep]

# df에서 DATE 타입은 날짜 형식으로 변환
df['RCEPT_BGNDE'] = pd.to_datetime(df['RCEPT_BGNDE'])
df['RCEPT_ENDDE'] = pd.to_datetime(df['RCEPT_ENDDE'])
df['SPSPLY_RCEPT_BGNDE'] = pd.to_datetime(df['SPSPLY_RCEPT_BGNDE'])
df['SPSPLY_RCEPT_ENDDE'] = pd.to_datetime(df['SPSPLY_RCEPT_ENDDE'])
df['GNRL_RNK1_CRSPAREA_RCPTDE'] = pd.to_datetime(df['GNRL_RNK1_CRSPAREA_RCPTDE'])
df['GNRL_RNK1_CRSPAREA_ENDDE'] = pd.to_datetime(df['GNRL_RNK1_CRSPAREA_ENDDE'])
df['GNRL_RNK1_ETC_GG_RCPTDE'] = pd.to_datetime(df['GNRL_RNK1_ETC_GG_RCPTDE'])
df['GNRL_RNK1_ETC_GG_ENDDE'] = pd.to_datetime(df['GNRL_RNK1_ETC_GG_ENDDE'])
df['GNRL_RNK1_ETC_AREA_RCPTDE'] = pd.to_datetime(df['GNRL_RNK1_ETC_AREA_RCPTDE'])
df['GNRL_RNK1_ETC_AREA_ENDDE'] = pd.to_datetime(df['GNRL_RNK1_ETC_AREA_ENDDE'])
df['GNRL_RNK2_CRSPAREA_RCPTDE'] = pd.to_datetime(df['GNRL_RNK2_CRSPAREA_RCPTDE'])
df['GNRL_RNK2_CRSPAREA_ENDDE'] = pd.to_datetime(df['GNRL_RNK2_CRSPAREA_ENDDE'])
df['GNRL_RNK2_ETC_GG_RCPTDE'] = pd.to_datetime(df['GNRL_RNK2_ETC_GG_RCPTDE'])
df['GNRL_RNK2_ETC_GG_ENDDE'] = pd.to_datetime(df['GNRL_RNK2_ETC_GG_ENDDE'])
df['GNRL_RNK2_ETC_AREA_RCPTDE'] = pd.to_datetime(df['GNRL_RNK2_ETC_AREA_RCPTDE'])
df['GNRL_RNK2_ETC_AREA_ENDDE'] = pd.to_datetime(df['GNRL_RNK2_ETC_AREA_ENDDE'])

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
df = df.drop(columns=['PBLANC_NO'])

# 2. 이미 존재하는 house_id 값 확인
with engine.connect() as conn:
    # 데이터베이스에서 존재하는 house_id 값을 가져옵니다
    result = conn.execute(text("SELECT house_id FROM detail01 WHERE house_id IN :house_id_list"),
                          {'house_id_list': tuple(df['house_id'].tolist())})

    # result를 딕셔너리 형식으로 변환하여 'house_id' 값만 추출합니다
    existing_pblanc_nos = {row['house_id'] for row in result.mappings()}

# 3. 데이터프레임에서 이미 존재하는 PBLANC_NO 값 필터링
df_filtered = df[~df['house_id'].isin(existing_pblanc_nos)]


# 4. 필터링된 데이터만 데이터베이스에 삽입
if not df_filtered.empty:
    df_filtered.to_sql('detail01', con=engine, if_exists='append', index=False)
    print("detail01: 데이터 베이스에 정보가 입력되었습니다.")
else:
    print("detail01: 신규 데이터가 없어 데이터를 저장하지 않았습니다.")
