package com.carepulse.hospital.model;

import java.util.List;

public class Doctor {
    private String id;
    private String name;
    private String nameBn;
    private String departmentId;
    private String specialty;
    private String specialtyBn;
    private String qualification;
    private String experience;
    private double fee;
    private String roomNumber;
    private String visitingHours;
    private String visitingHoursBn;
    private List<String> availableDays;
    private double rating;
    private int reviewCount;
    private String avatarUrl;
    private String phone;
    private boolean isAvailable;

    public Doctor() {}

    public Doctor(String id, String name, String nameBn, String departmentId, String specialty,
                  String specialtyBn, String qualification, String experience, double fee,
                  String roomNumber, String visitingHours, String visitingHoursBn,
                  List<String> availableDays, double rating, int reviewCount,
                  String avatarUrl, String phone, boolean isAvailable) {
        this.id = id;
        this.name = name;
        this.nameBn = nameBn;
        this.departmentId = departmentId;
        this.specialty = specialty;
        this.specialtyBn = specialtyBn;
        this.qualification = qualification;
        this.experience = experience;
        this.fee = fee;
        this.roomNumber = roomNumber;
        this.visitingHours = visitingHours;
        this.visitingHoursBn = visitingHoursBn;
        this.availableDays = availableDays;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.avatarUrl = avatarUrl;
        this.phone = phone;
        this.isAvailable = isAvailable;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getNameBn() { return nameBn; }
    public void setNameBn(String nameBn) { this.nameBn = nameBn; }

    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }

    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }

    public String getSpecialtyBn() { return specialtyBn; }
    public void setSpecialtyBn(String specialtyBn) { this.specialtyBn = specialtyBn; }

    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public double getFee() { return fee; }
    public void setFee(double fee) { this.fee = fee; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public String getVisitingHours() { return visitingHours; }
    public void setVisitingHours(String visitingHours) { this.visitingHours = visitingHours; }

    public String getVisitingHoursBn() { return visitingHoursBn; }
    public void setVisitingHoursBn(String visitingHoursBn) { this.visitingHoursBn = visitingHoursBn; }

    public List<String> getAvailableDays() { return availableDays; }
    public void setAvailableDays(List<String> availableDays) { this.availableDays = availableDays; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public int getReviewCount() { return reviewCount; }
    public void setReviewCount(int reviewCount) { this.reviewCount = reviewCount; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean available) { isAvailable = available; }
}
