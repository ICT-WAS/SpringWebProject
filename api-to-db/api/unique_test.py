import pandas as pd

a = pd.read_csv('../APT 분양정보 상세조회.csv')
b = pd.read_csv('../APT 무순위 및 잔여세대 분양정보 상세조회.csv')

print(2020000040 in a['PBLANC_NO'].array)

print(a['PBLANC_NO'].is_unique)
print(b['PBLANC_NO'].is_unique)
print(a['HOUSE_MANAGE_NO'].is_unique)
print(b['HOUSE_MANAGE_NO'].is_unique)

c = a['PBLANC_NO']
d = b['PBLANC_NO']
e = pd.concat([c, d], ignore_index=True)
print(type(e))
print(e.is_unique)

c = a['HOUSE_MANAGE_NO']
d = b['HOUSE_MANAGE_NO']
e = pd.concat([c, d], ignore_index=True)
print(type(e))
print(e.is_unique)

c = a['PBLANC_NO']
d = a['HOUSE_MANAGE_NO']
print(type(c))
print(c.equals(d))

c = b['PBLANC_NO']
d = b['HOUSE_MANAGE_NO']
print(type(c))
print(c.equals(d))

# ==> PBLANC_NO 와 HOUSE_MANAGE_NO 는 항상 일치하며, unique.

a = pd.read_csv('../APT 분양정보 상세조회.csv')
b = pd.read_csv('../APT 분양정보 주택형별 상세조회.csv')

b_unique = b.drop_duplicates(subset=['HOUSE_MANAGE_NO'], ignore_index=True)
print(b)
print(b['HOUSE_MANAGE_NO'].is_unique)
print(b_unique)
print(b_unique['HOUSE_MANAGE_NO'].is_unique)
print(a['HOUSE_MANAGE_NO'].equals(b_unique['HOUSE_MANAGE_NO']))