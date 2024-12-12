package com.ict.home.condition.serivce;

import com.ict.home.condition.repository.AccountRepository;
import com.ict.home.condition.repository.Condition01Repository;
import com.ict.home.condition.repository.Condition03Repository;
import com.ict.home.condition.repository.FamilyRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ConditionServiceImpl implements ConditionService{

    @PersistenceContext
    private final EntityManager em;

    private final AccountRepository ar;

    private final Condition01Repository c01r;

    private final Condition03Repository c03r;

    private final FamilyRepository fr;


    @Override
    public ResponseEntity<String> deleteConditions(Long userId) {
        ar.deleteByUser_Id(userId);
        c01r.deleteByUser_Id(userId);
        c03r.deleteByUser_Id(userId);
        fr.deleteByUser_Id(userId);

        if (c03r.findByUser_Id(userId) != null) {
            return ResponseEntity.status(404).body("삭제 실패");
        } else if (!fr.findByUser_Id(userId).isEmpty()) {
            return ResponseEntity.status(404).body("삭제 실패");
        } else if (c01r.findByUser_Id(userId) != null) {
            return ResponseEntity.status(404).body("삭제 실패");
        } else if (!ar.findByUser_Id(userId).isEmpty()) {
            return ResponseEntity.status(404).body("삭제 실패");
        }

        return ResponseEntity.ok("삭제 완료");
    }
}
