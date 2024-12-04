import pandas as pd

import requests

import utility

api_key = utility.api_key  # api 인증키
base_url = 'https://api.odcloud.kr/api'

def getAPT():
    _page = 1
    list = []
    while True:
        getAPTDetail = '/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail'
        page = str(_page)
        perPage = '10'
        HOUSE_SECD = '01'  # APT
        request_url = base_url + getAPTDetail + '?page=' + page + '&perPage=' + perPage + '&cond%5BHOUSE_SECD%3A%3AEQ%5D=' + HOUSE_SECD + '&serviceKey=' + api_key
        response = requests.get(request_url).json()

        if response['currentCount'] == 0:  # 더 이상 데이터가 없는 경우
            print('데이터가 없습니다.')
            break

        data = response['data']
        list.append(pd.DataFrame(data))
        _page += 1

    new_df = pd.concat(list)
    print(new_df)
    new_df.to_csv('../APT 분양정보 상세조회.csv', index=False)


def getAPT2():
    _page = 1
    list = []
    while True:
        getAPTDetail = '/ApplyhomeInfoDetailSvc/v1/getRemndrLttotPblancDetail'
        page = str(_page)
        perPage = '10'
        HOUSE_SECD = '04'  # 무순위/잔여세대
        request_url = base_url + getAPTDetail + '?page=' + page + '&perPage=' + perPage + '&cond%5BHOUSE_SECD%3A%3AEQ%5D=' + HOUSE_SECD + '&serviceKey=' + api_key
        response = requests.get(request_url).json()

        if response['currentCount'] == 0:  # 더 이상 데이터가 없는 경우
            print('데이터가 없습니다.')
            break

        data = response['data']
        list.append(pd.DataFrame(data))
        _page += 1

    new_df = pd.concat(list)
    print(new_df)
    new_df.to_csv('../APT 무순위 및 잔여세대 분양정보 상세조회.csv', index=False)


getAPT()

getAPT2()
