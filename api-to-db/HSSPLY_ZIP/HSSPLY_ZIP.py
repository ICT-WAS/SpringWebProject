import pandas as pd

df = pd.read_csv("HSSPLY_ZIP.csv", encoding="utf-8")
for index, row in df.iterrows():
    print('new PostalCodeRange("' + row['시/도'] + '", "' + row['군/구'].split(' ')[0] + '", ' + str(row['시작']) + ', ' + str(row['종료']) + '),')
    # new PostalCodeRange("서울특별시 종로구", 10000, 10999),
