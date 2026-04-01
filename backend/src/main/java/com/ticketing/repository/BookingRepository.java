package com.ticketing.repository;

import com.ticketing.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * REPOSITORY for Booking entity.
 * We add a custom query method here — Spring Data JPA reads the method name
 * and automatically generates the SQL: SELECT * FROM bookings WHERE event_id = ?
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Custom finder — Spring generates SQL from the method name automatically
    List<Booking> findByEventId(Long eventId);
}
