package com.sagarvk18.streaming.dto.request;

import lombok.Data;

@Data
public class PaymentRequest {
    private Long planId;
    private String paymentMethod; // CARD, UPI, NETBANKING
    private String cardNumber;
    private String expiry;
    private String cvv;
    private String upiId;
}
