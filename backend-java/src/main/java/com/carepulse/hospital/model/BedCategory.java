package com.carepulse.hospital.model;

public class BedCategory {
    private String id;
    private String name;
    private String nameBn;
    private String type; // "icu", "ccu", "general", "cabin_vip", "cabin_deluxe", "pediatric"
    private int total;
    private int occupied;
    private double dailyPrice;
    private String floor;

    public BedCategory() {}

    public BedCategory(String id, String name, String nameBn, String type, int total, int occupied, double dailyPrice, String floor) {
        this.id = id;
        this.name = name;
        this.nameBn = nameBn;
        this.type = type;
        this.total = total;
        this.occupied = occupied;
        this.dailyPrice = dailyPrice;
        this.floor = floor;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getNameBn() { return nameBn; }
    public void setNameBn(String nameBn) { this.nameBn = nameBn; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }

    public int getOccupied() { return occupied; }
    public void setOccupied(int occupied) { this.occupied = occupied; }

    public double getDailyPrice() { return dailyPrice; }
    public void setDailyPrice(double dailyPrice) { this.dailyPrice = dailyPrice; }

    public String getFloor() { return floor; }
    public void setFloor(String floor) { this.floor = floor; }

    public int getAvailable() { return Math.max(0, this.total - this.occupied); }
}
