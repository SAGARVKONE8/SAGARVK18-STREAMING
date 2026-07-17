package com.sagarvk18.streaming.service;

import com.sagarvk18.streaming.dto.request.PaymentRequest;
import com.sagarvk18.streaming.entity.Payment;
import com.sagarvk18.streaming.entity.SubscriptionPlan;
import com.sagarvk18.streaming.entity.User;
import com.sagarvk18.streaming.repository.PaymentRepository;
import com.sagarvk18.streaming.repository.SubscriptionPlanRepository;
import com.sagarvk18.streaming.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SubscriptionService {
    private final SubscriptionPlanRepository planRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    public List<SubscriptionPlan> getActivePlans() {
        return planRepository.findByActive(true);
    }

    @Transactional
    public Payment processPayment(Long userId, PaymentRequest request) {
        User user = userRepository.findById(userId).orElseThrow();
        SubscriptionPlan plan = planRepository.findById(request.getPlanId()).orElseThrow();

        // Validate banking details
        if (request.getCardNumber() == null || !request.getCardNumber().replaceAll("\\s", "").matches("\\d{16}")) {
            throw new RuntimeException("Invalid card number. Must be 16 digits.");
        }
        if (request.getExpiry() == null || !request.getExpiry().matches("(0[1-9]|1[0-2])/[0-9]{2}")) {
            throw new RuntimeException("Invalid expiry date. Must be MM/YY.");
        }
        if (request.getCvv() == null || !request.getCvv().matches("\\d{3}")) {
            throw new RuntimeException("Invalid CVV. Must be 3 digits.");
        }

        // Mock payment processing
        String txId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Payment payment = Payment.builder()
                .user(user)
                .plan(plan)
                .amount(plan.getPrice())
                .currency("INR")
                .status("SUCCESS") // Mock: always success
                .transactionId(txId)
                .paymentMethod(request.getPaymentMethod())
                .build();
        paymentRepository.save(payment);

        // Update user subscription
        User.SubscriptionType subType = User.SubscriptionType.valueOf(plan.getName().toUpperCase());
        user.setSubscriptionType(subType);
        userRepository.save(user);
        return payment;
    }

    public List<Payment> getUserPayments(Long userId) {
        return paymentRepository.findByUserId(userId);
    }
}
