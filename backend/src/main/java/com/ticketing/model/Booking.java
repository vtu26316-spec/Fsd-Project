package com.ticketing.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

/**
 * BOOKING ENTITY
 * @JsonIgnoreProperties on the event field prevents infinite JSON loop:
 * Booking serializes Event, which would serialize its bookings list, which
 * would serialize Booking again — causing a StackOverflow.
 */
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "customer_email", nullable = false)
    private String customerEmail;

    @Column(name = "tickets", nullable = false)
    private int tickets;

    @Column(name = "total_price", nullable = false)
    private double totalPrice;

    @Column(name = "booking_reference", unique = true)
    private String bookingReference;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    @JsonIgnoreProperties({"bookings", "hibernateLazyInitializer"})
    private Event event;

    public Booking() {}

    public Booking(String customerName, String customerEmail, int tickets,
                   double totalPrice, String bookingReference, Event event) {
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.tickets = tickets;
        this.totalPrice = totalPrice;
        this.bookingReference = bookingReference;
        this.event = event;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public int getTickets() { return tickets; }
    public void setTickets(int tickets) { this.tickets = tickets; }

    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }

    public String getBookingReference() { return bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }
}
