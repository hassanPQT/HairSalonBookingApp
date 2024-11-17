package com.example.hairSalonBooking.model.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class StylistFeedBackResponse {
    Long stylistId;
    String stylistName;
//    int FeedBackQuantity;
    Double averageFeedback;
}
