package com.ict.home.util;

import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class) // 생성일, 수정일, 생성자, 수정자 정보를 자동으로 관리해줌
public class BaseTimeEntity {
    @CreatedDate
    private LocalDateTime createDate;
    @LastModifiedDate
    private LocalDateTime modifiedDate;

    @PrePersist
    public void prePersist() {
        this.createDate = LocalDateTime.now();
        if (modifiedDate == null) {
            this.modifiedDate = LocalDateTime.now();
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.modifiedDate = LocalDateTime.now();

    }
}
