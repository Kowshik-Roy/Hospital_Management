package com.carepulse.hospital.model;

import java.util.List;

public class Patient {
    private String id;
    private String name;
    private String nameBn;
    private String phone;
    private String email;
    private int age;
    private String gender; // "male", "female", "other"
    private String bloodGroup; // "A+", "B+", "O+", etc.
    private String emergencyContact;
    private String address;
    private String allergies;
    private String registeredDate;
    private List<String> chronicDiseases;

    public Patient() {}

    public Patient(String id, String name, String nameBn, String phone, String email, int age,
                   String gender, String bloodGroup, String emergencyContact, String address,
                   String allergies, String registeredDate, List<String> chronicDiseases) {
        this.id = id;
        this.name = name;
        this.nameBn = nameBn;
        this.phone = phone;
        this.email = email;
        this.age = age;
        this.gender = gender;
        this.bloodGroup = bloodGroup;
        this.emergencyContact = emergencyContact;
        this.address = address;
        this.allergies = allergies;
        this.registeredDate = registeredDate;
        this.chronicDiseases = chronicDiseases;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getNameBn() { return nameBn; }
    public void setNameBn(String nameBn) { this.nameBn = nameBn; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }

    public String getRegisteredDate() { return registeredDate; }
    public void setRegisteredDate(String registeredDate) { this.registeredDate = registeredDate; }

    public List<String> getChronicDiseases() { return chronicDiseases; }
    public void setChronicDiseases(List<String> chronicDiseases) { this.chronicDiseases = chronicDiseases; }
}
