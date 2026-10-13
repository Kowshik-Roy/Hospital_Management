package com.carepulse.hospital;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * CarePulse Hospital Management System
 * Core Enterprise Java Spring Boot REST API
 */
@SpringBootApplication
public class HospitalManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(HospitalManagementApplication.class, args);
        System.out.println("=========================================================");
        System.out.println("🏥 CarePulse Hospital Management System (Java Backend)");
        System.out.println("🚀 REST API running at: http://localhost:8080");
        System.out.println("🔗 Frontend connected: React + Vite on http://localhost:5173");
        System.out.println("=========================================================");
    }
}
