export enum FamilyMember {
    SELF = 1,            // 본인
    SPOUSE = 2,          // 배우자
    MOTHER = 3,          // 어머니
    FATHER = 4,          // 아버지
    GRANDMOTHER = 5,     // 할머니
    GRANDFATHER = 6,     // 할아버지
    GREAT_GRANDMOTHER = 7, // 증조할머니
    GREAT_GRANDFATHER = 8, // 증조할아버지
    CHILD = 9,           // 자녀
    UNBORN_CHILD = 10,   // 자녀(태아)
    GRANDCHILD_NO_GUARDIAN = 11, // 부모(신청자 본인의 자녀)가 사망하여 양육자가 없는 손자녀
    SON_IN_LAW_OR_DAUGHTER_IN_LAW = 12, // 사위 또는 며느리
    SPOUSE_MOTHER = 13,  // 배우자의 어머니
    SPOUSE_FATHER = 14,  // 배우자의 아버지
    SPOUSE_GRANDMOTHER = 15, // 배우자의 할머니
    SPOUSE_GRANDFATHER = 16, // 배우자의 할아버지
    SPOUSE_GREAT_GRANDMOTHER = 17, // 배우자의 증조할머니
    SPOUSE_GREAT_GRANDFATHER = 18, // 배우자의 증조할아버지
}

// 
export function getEnumKeyFromValue(enumObj: any, value: number): string | undefined {
    const entry = Object.entries(enumObj).find(([key, val]) => val === value);
    return entry ? entry[0] : undefined;
}

// 숫자로 한글이름 찾기
export function getFamilyMemberName(value: number): string | undefined {
    const key = getEnumKeyFromValue(FamilyMember, value);
    return key ? familyMemberNames[FamilyMember[key as keyof typeof FamilyMember]] : undefined;
}

export const familyMemberNames: { [key in FamilyMember]: string } = {
    [FamilyMember.SELF]: '본인',
    [FamilyMember.SPOUSE]: '배우자',
    [FamilyMember.MOTHER]: '어머니',
    [FamilyMember.FATHER]: '아버지',
    [FamilyMember.GRANDMOTHER]: '할머니',
    [FamilyMember.GRANDFATHER]: '할아버지',
    [FamilyMember.GREAT_GRANDMOTHER]: '증조할머니',
    [FamilyMember.GREAT_GRANDFATHER]: '증조할아버지',
    [FamilyMember.CHILD]: '자녀',
    [FamilyMember.UNBORN_CHILD]: '자녀(태아)',
    [FamilyMember.SON_IN_LAW_OR_DAUGHTER_IN_LAW]: '사위 또는 며느리',
    [FamilyMember.SPOUSE_MOTHER]: '배우자의 어머니',
    [FamilyMember.SPOUSE_FATHER]: '배우자의 아버지',
    [FamilyMember.SPOUSE_GRANDMOTHER]: '배우자의 할머니',
    [FamilyMember.SPOUSE_GRANDFATHER]: '배우자의 할아버지',
    [FamilyMember.SPOUSE_GREAT_GRANDMOTHER]: '배우자의 증조할머니',
    [FamilyMember.SPOUSE_GREAT_GRANDFATHER]: '배우자의 증조할아버지',
    [FamilyMember.GRANDCHILD_NO_GUARDIAN]: '부모(신청자 본인의 자녀)가 사망하여 양육자가 없는 손자녀',
  };