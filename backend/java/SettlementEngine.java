package com.aurelius.settlement;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.dao.OptimisticLockingFailureException;
import java.math.BigDecimal;
import java.time.Instant;

@Service
public class SettlementEngine {

    private final LedgerRepository ledgerRepository;
    private final AuditLogger auditLogger;

    public SettlementEngine(LedgerRepository ledgerRepository, AuditLogger auditLogger) {
        this.ledgerRepository = ledgerRepository;
        this.auditLogger = auditLogger;
    }

    @Transactional(rollbackFor = Exception.class)
    public TransactionRecord executeTransfer(String assetId, String recipient, BigDecimal amount, Long version) {
        Asset asset = ledgerRepository.findById(assetId)
            .orElseThrow(() -> new AssetNotFoundException(assetId));

        if (!asset.getVersion().equals(version)) {
            throw new OptimisticLockingFailureException("Asset state modified concurrently");
        }

        if (asset.getAvailableBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException(assetId, amount, asset.getAvailableBalance());
        }

        asset.debit(amount);
        ledgerRepository.save(asset);
        
        LedgerEntry entry = LedgerEntry.builder()
            .assetId(assetId)
            .recipient(recipient)
            .amount(amount)
            .timestamp(Instant.now())
            .status(SettlementStatus.PENDING_CLEARING)
            .build();
            
        LedgerEntry savedEntry = ledgerRepository.save(entry);
        auditLogger.logSettlement(savedEntry.getId(), SettlementStatus.PENDING_CLEARING);
        
        return new TransactionRecord(savedEntry.getId(), SettlementStatus.PENDING_CLEARING);
    }
}
