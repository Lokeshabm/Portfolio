package com.lokesha.portfolio.model;

import java.util.List;

public class Project {
    private int id;
    private String title;
    private String category;
    private String description;
    private List<String> technologies;
    private List<String> features;
    private String githubUrl;
    private String liveDemoUrl;
    private String image;

    public Project() {}

    public Project(int id, String title, String category, String description,
                   List<String> technologies, List<String> features,
                   String githubUrl, String liveDemoUrl, String image) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.description = description;
        this.technologies = technologies;
        this.features = features;
        this.githubUrl = githubUrl;
        this.liveDemoUrl = liveDemoUrl;
        this.image = image;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getTechnologies() { return technologies; }
    public void setTechnologies(List<String> technologies) { this.technologies = technologies; }

    public List<String> getFeatures() { return features; }
    public void setFeatures(List<String> features) { this.features = features; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getLiveDemoUrl() { return liveDemoUrl; }
    public void setLiveDemoUrl(String liveDemoUrl) { this.liveDemoUrl = liveDemoUrl; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
}
