package com.carepulse.hospital.model;

public class HospitalSettings {
    private String hospitalName;
    private String hospitalNameBn;
    private String tagline;
    private String taglineBn;
    private String address;
    private String addressBn;
    private String hotline;
    private String ambulancePhone;
    private String email;
    private String website;
    private String licenseNumber;
    private String taxId;
    private double taxRatePercent;
    private String currency;
    private String currencySymbol;

    public HospitalSettings() {}

    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }

    public String getHospitalNameBn() { return hospitalNameBn; }
    public void setHospitalNameBn(String hospitalNameBn) { this.hospitalNameBn = hospitalNameBn; }

    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }

    public String getTaglineBn() { return taglineBn; }
    public void setTaglineBn(String taglineBn) { this.taglineBn = taglineBn; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getAddressBn() { return addressBn; }
    public void setAddressBn(String addressBn) { this.addressBn = addressBn; }

    public String getHotline() { return hotline; }
    public void setHotline(String hotline) { this.hotline = hotline; }

    public String getAmbulancePhone() { return ambulancePhone; }
    public void setAmbulancePhone(String ambulancePhone) { this.ambulancePhone = ambulancePhone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public String getTaxId() { return taxId; }
    public void setTaxId(String taxId) { this.taxId = taxId; }

    public double getTaxRatePercent() { return taxRatePercent; }
    public void setTaxRatePercent(double taxRatePercent) { this.taxRatePercent = taxRatePercent; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getCurrencySymbol() { return currencySymbol; }
    public void setCurrencySymbol(String currencySymbol) { this.currencySymbol = currencySymbol; }
}
