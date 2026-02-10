package com.victor.softwave.payload.request;

import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class QuoteRequest {
    private String language;
    private String customerName;
    private String companyName;
    private String email;
    private String phone;
    private String note;
    private List<QuoteItem> items;
}
