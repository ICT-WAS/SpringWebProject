export const conditions = {
    pages: [{
        page: 1, pageName: '신청자 정보', items: [
            {
                questionNumber: 1,
                question: '신청자 생년월일',
                type: input,
                minLength: 8,
                maxLength: 8,
            },
            {
                questionNumber: 2,
                question: '현재 거주지역',
                type: dropdown,
                values: [
                    {index: 1, name: '시/도', values: [{value: '서울특별시'}]},
                    {index: 2, name: '군/구', values: [{value: '서울특별시'}]},
                ]
            },
            {
                questionNumber: 3,
                question: '현재 거주지에 입주한 날(주민등록표등본에 있는 전입일자)',
                type: input,
                minLength: 8,
                maxLength: 8,
            },
            {
                questionNumber: 4,
                question: '세대주 여부',
                type: radio,
                values: [
                    {index: 1, name: '시/도', values: [{value: '서울특별시'}]},
                ]
            },
        ]
    }]
}