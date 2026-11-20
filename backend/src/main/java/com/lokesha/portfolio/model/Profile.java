package com.lokesha.portfolio.model;

import java.util.List;
import java.util.Map;

public class Profile {
    private String name;
    private String designation;
    private String bio;
    private String careerObjective;
    private String careerGoals;
    private String education;
    private String university;
    private double cgpa;
    private List<String> languages;
    private Map<String, String> socialLinks;
    private String email;
    private String location;

    public Profile() {}

    public Profile(String name, String designation, String bio, String careerObjective,
                   String careerGoals, String education, String university, double cgpa,
                   List<String> languages, Map<String, String> socialLinks, String email, String location) {
        this.name = name;
        this.designation = designation;
        this.bio = bio;
        this.careerObjective = careerObjective;
        this.careerGoals = careerGoals;
        this.education = education;
        this.university = university;
        this.cgpa = cgpa;
        this.languages = languages;
        this.socialLinks = socialLinks;
        this.email = email;
        this.location = location;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getCareerObjective() { return careerObjective; }
    public void setCareerObjective(String careerObjective) { this.careerObjective = careerObjective; }

    public String getCareerGoals() { return careerGoals; }
    public void setCareerGoals(String careerGoals) { this.careerGoals = careerGoals; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public String getUniversity() { return university; }
    public void setUniversity(String university) { this.university = university; }

    public double getCgpa() { return cgpa; }
    public void setCgpa(double cgpa) { this.cgpa = cgpa; }

    public List<String> getLanguages() { return languages; }
    public void setLanguages(List<String> languages) { this.languages = languages; }

    public Map<String, String> getSocialLinks() { return socialLinks; }
    public void setSocialLinks(Map<String, String> socialLinks) { this.socialLinks = socialLinks; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
