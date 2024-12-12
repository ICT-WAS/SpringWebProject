import pandas as pd
import os
import requests

import utility

api_key = utility.api_key  # api 인증키
base_url = 'https://api.odcloud.kr/api'


def getAPTDetail():
    save_file_name = '../APT 분양정보 주택형별 상세조회.csv'
    _page = 1
    getlist = []
    APTList = pd.read_csv('../APT 분양정보 상세조회.csv')
    finished_PBLANC_NO = ''
    if os.path.exists(save_file_name):
        finished_PBLANC_NO = pd.read_csv(save_file_name).drop_duplicates(subset=['PBLANC_NO'], ignore_index=True)[
            'PBLANC_NO']

    for PBLANC_NO in APTList.get('PBLANC_NO'):
        if os.path.exists(save_file_name):
            if PBLANC_NO in finished_PBLANC_NO.array:
                print(str(PBLANC_NO) + '는 이미 존재하는 공고번호 입니다. 탐색을 중단합니다.')
                break

        getAPTDetail = '/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancMdl'
        page = str(_page)
        perPage = '1000'
        PBLANC_NO = str(PBLANC_NO)
        HOUSE_MANAGE_NO = PBLANC_NO
        request_url = base_url + getAPTDetail + '?page=' + page + '&perPage=' + perPage + '&cond%5BHOUSE_MANAGE_NO%3A%3AEQ%5D=' + HOUSE_MANAGE_NO + '&cond%5BPBLANC_NO%3A%3AEQ%5D=' + PBLANC_NO + '&serviceKey=' + api_key
        response = requests.get(request_url).json()

        if response['currentCount'] == 0:  # 데이터가 없는 경우
            print(request_url + ' 은 데이터가 없습니다.')
            continue

        data = response['data']
        print(data)
        getlist.append(pd.DataFrame(data))
    if not len(getlist) == 0:
        new_df = pd.concat(getlist)

        if os.path.exists(save_file_name):
            existing_df = pd.read_csv(save_file_name)

            final_df = pd.concat([new_df, existing_df], ignore_index=True)
        else:
            final_df = new_df

        final_df.to_csv(save_file_name, index=False)


def getAPTDetail2():
    save_file_name = '../APT 무순위 및 잔여세대 분양정보 주택형별 상세조회.csv'
    _page = 1
    getlist = []
    APTList = pd.read_csv('../APT 무순위 및 잔여세대 분양정보 상세조회.csv')
    finished_PBLANC_NO = ''
    if os.path.exists(save_file_name):
        finished_PBLANC_NO = pd.read_csv(save_file_name).drop_duplicates(subset=['PBLANC_NO'], ignore_index=True)[
            'PBLANC_NO']

    for PBLANC_NO in APTList.get('PBLANC_NO'):
        if os.path.exists(save_file_name):
            if PBLANC_NO in finished_PBLANC_NO.array:
                print(str(PBLANC_NO) + '는 이미 존재하는 공고번호 입니다. 탐색을 중단합니다.')
                break
        getAPTDetail = '/ApplyhomeInfoDetailSvc/v1/getRemndrLttotPblancMdl'
        page = str(_page)
        perPage = '1000'
        PBLANC_NO = str(PBLANC_NO)
        HOUSE_MANAGE_NO = PBLANC_NO
        request_url = base_url + getAPTDetail + '?page=' + page + '&perPage=' + perPage + '&cond%5BHOUSE_MANAGE_NO%3A%3AEQ%5D=' + HOUSE_MANAGE_NO + '&cond%5BPBLANC_NO%3A%3AEQ%5D=' + PBLANC_NO + '&serviceKey=' + api_key
        response = requests.get(request_url).json()
        if response['currentCount'] == 0:  # 데이터가 없는 경우
            print(request_url + ' 은 데이터가 없습니다.')
            continue
        # end if
        data = response['data']
        print(data)
        getlist.append(pd.DataFrame(data))

    if not len(getlist) == 0:
        new_df = pd.concat(getlist)

        if os.path.exists(save_file_name):
            existing_df = pd.read_csv(save_file_name)

            final_df = pd.concat([new_df, existing_df], ignore_index=True)
        else:
            final_df = new_df

        final_df.to_csv(save_file_name, index=False)


getAPTDetail()

getAPTDetail2()
