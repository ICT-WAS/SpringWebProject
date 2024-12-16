package com.ict.home.condition.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class ConditionDTO {

    @NotNull
    private Condition01DTO condition01DTO;

    @NotNull
    private List<AccountDTO> accountDTOList;

    @NotNull
    private Condition03DTO condition03DTO;

    @NotNull
    private List<FamilyDTO> familyDTOList;
}
