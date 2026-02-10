package com.victor.softwave.payload.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuoteItem {
    private String description;
    private int quantity;
    private double unitPrice;
    private double total;
}
