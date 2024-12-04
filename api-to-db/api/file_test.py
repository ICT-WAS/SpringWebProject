import pandas as pd
column = 'LTTOT_TOP_AMOUNT'
df_apt = pd.read_csv('../APT 분양정보 주택형별 상세조회.csv')
print('APT 분양정보 주택형별 상세조회.csv')
print(df_apt[column])
print(df_apt[column].unique())
print('============================================================')

df_apt2 = pd.read_csv('../APT 무순위 및 잔여세대 분양정보 주택형별 상세조회.csv')
print('APT 무순위 및 잔여세대 분양정보 주택형별 상세조회.csv')
print(df_apt2[column])
print(df_apt2[column].unique())
print('============================================================')

df_sum = pd.concat([df_apt[column], df_apt2[column]], ignore_index=True)
# print(df_sum)
# print(df_sum.isna())
# for one in df_sum:
#     if one:
#         print(one)
print(df_sum.info())