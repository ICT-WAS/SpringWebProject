import { conditionSubCategory } from "../apply_announcement/conditionInfo";

// filters를 쿼리 파라미터로 변환하는 함수
export function convertFiltersToQuery(selectedFilter) {
  let param = {};

  selectedFilter.map((filter) => {

    const subcategories = filter.subcategories;

    subcategories.map((sub) => {
      sub.values.map((value) => {
        if (filter.category === '희망지역') {
          param['regions'] = [
            ...(param['regions'] || []),
            value.submitData ? value.submitData : value.value
          ];
        } else if (sub.category === '공급금액') {
          param[conditionSubCategory[sub.category]] = [
            ...(param[conditionSubCategory[sub.category]] || []),
            ...value.submitData.slice(0, 2)
          ];
        } else {
          param[conditionSubCategory[sub.category]] = [
            ...(param[conditionSubCategory[sub.category]] || []),
            value.submitData
          ];
        }
      });
    });
  });

  return param;
}

export function convertFiltersToUrl(filters) {
  let queryParams = {};

  Object.keys(filters).forEach(key => {
    // 배열을 콤마(,)로 결합하여 하나의 문자열로 변환
    queryParams[key] = filters[key].join(',');
  });

  return queryParams;
}