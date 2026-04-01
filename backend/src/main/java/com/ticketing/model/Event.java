package com.ticketing.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "events")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private String venue;

    @Column(nullable = false)
    private String date;

    @Column(name = "total_capacity", nullable = false)
    private int totalCapacity;

    @Column(name = "booked_seats", nullable = false)
    private int bookedSeats;

    @Column(nullable = false)
    private double price;

    public Event() {}

    public Event(String name, String description, String venue, String date,
                 int totalCapacity, int bookedSeats, double price) {
        this.name = name;
        this.description = description;
        this.venue = venue;
        this.date = date;
        this.totalCapacity = totalCapacity;
        this.bookedSeats = bookedSeats;
        this.price = price;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public int getTotalCapacity() { return totalCapacity; }
    public void setTotalCapacity(int totalCapacity) { this.totalCapacity = totalCapacity; }

    public int getBookedSeats() { return bookedSeats; }
    public void setBookedSeats(int bookedSeats) { this.bookedSeats = bookedSeats; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public int getAvailableSeats() {
        return totalCapacity - bookedSeats;
    }
}
