package com.carepulse.hospital.model;

public class InvoiceItem {
    private String id;
    private String description;
    private String descriptionBn;
    private String category; // "consultation", "test", "bed", "medicine", "procedure"
    private int quantity;
    private double unitPrice;
    private double total;

    public InvoiceItem() {}

    public InvoiceItem(String id, String description, String descriptionBn, String category, int quantity, double unitPrice, double total) {
        this.id = id;
        this.description = description;
        this.descriptionBn = descriptionBn;
        this.category = category;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.total = total;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDescriptionBn() { return descriptionBn; }
    public void setDescriptionBn(String descriptionBn) { this.descriptionBn = descriptionBn; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(double unitPrice) { this.unitPrice = unitPrice; }

    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }
}
