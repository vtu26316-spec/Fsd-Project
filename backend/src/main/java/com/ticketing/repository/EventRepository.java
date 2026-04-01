package com.ticketing.repository;

import com.ticketing.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * REPOSITORY LAYER (Data Access Layer)
 *
 * This interface extends JpaRepository which gives us FREE database methods:
 *   - findAll()       → SELECT * FROM events
 *   - findById(id)    → SELECT * FROM events WHERE id = ?
 *   - save(event)     → INSERT or UPDATE
 *   - deleteById(id)  → DELETE FROM events WHERE id = ?
 *
 * We don't write any SQL — Spring Data JPA generates it automatically!
 *
 * @Repository - marks this as a Spring-managed data access component
 */
@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    // JpaRepository<Event, Long> means:
    //   Event = the entity type
    //   Long  = the type of the primary key (id)
}
