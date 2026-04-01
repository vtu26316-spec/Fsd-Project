package com.ticketing;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * ENTRY POINT of the Spring Boot application.
 * @SpringBootApplication combines three annotations:
 *   - @Configuration: marks this as a config class
 *   - @EnableAutoConfiguration: Spring auto-configures beans based on classpath
 *   - @ComponentScan: scans this package for controllers, services, repositories
 */
@SpringBootApplication
public class TicketingApplication {
    public static void main(String[] args) {
        SpringApplication.run(TicketingApplication.class, args);
        System.out.println("✅ Ticketing Platform API running at http://localhost:8080");
    }
}
