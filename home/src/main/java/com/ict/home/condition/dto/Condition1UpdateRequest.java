package com.ict.home.condition.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class Condition1UpdateRequest {
    @NotNull
    private Condition01DTO condition01DTO;
    @NotNull
    private List<AccountDTO> accountDTOList;
}
