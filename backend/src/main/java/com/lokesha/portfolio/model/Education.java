package com.lokesha.portfolio.model;

import java.util.List;

public class Education {
    private String degree;
    private String field;
    private String institution;
    private String location;
    private String score;
    private String duration;
    private List<String> highlights;

    public Education() {}

    public Education(String degree, String field, String institution, String location,
                     String score, String duration, List<String> highlights) {
        this.degree = degree;
        this.field = field;
        this.institution = institution;
        this.location = location;
        this.score = score;
        this.duration = duration;
        this.highlights = highlights;
    }

    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }

    public String getField() { return field; }
    public void setField(String field) { this.field = field; }

    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getScore() { return score; }
    public void setScore(String score) { this.score = score; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public List<String> getHighlights() { return highlights; }
    public void setHighlights(List<String> highlights) { this.highlights = highlights; }
}
