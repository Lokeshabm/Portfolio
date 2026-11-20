package com.lokesha.portfolio.model;

/**
 * Model representing an anonymous project interaction activity.
 * Tracks card views, detail views, GitHub clicks, and Live Demo clicks
 * without recording any personally identifiable information (PII).
 */
public class ProjectActivity {
    private int id;
    private String visitorId;
    private int projectId;
    private String projectName;
    private String action;
    private String activityDate;
    private String activityTime;
    private String deviceType;
    private String browser;
    private String trafficSource;
    private String createdAt;

    public ProjectActivity() {}

    public ProjectActivity(int id, String visitorId, int projectId, String projectName,
                           String action, String activityDate, String activityTime,
                           String deviceType, String browser, String trafficSource,
                           String createdAt) {
        this.id = id;
        this.visitorId = visitorId;
        this.projectId = projectId;
        this.projectName = projectName;
        this.action = action;
        this.activityDate = activityDate;
        this.activityTime = activityTime;
        this.deviceType = deviceType;
        this.browser = browser;
        this.trafficSource = trafficSource;
        this.createdAt = createdAt;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getVisitorId() { return visitorId; }
    public void setVisitorId(String visitorId) { this.visitorId = visitorId; }

    public int getProjectId() { return projectId; }
    public void setProjectId(int projectId) { this.projectId = projectId; }

    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getActivityDate() { return activityDate; }
    public void setActivityDate(String activityDate) { this.activityDate = activityDate; }

    public String getActivityTime() { return activityTime; }
    public void setActivityTime(String activityTime) { this.activityTime = activityTime; }

    public String getDeviceType() { return deviceType; }
    public void setDeviceType(String deviceType) { this.deviceType = deviceType; }

    public String getBrowser() { return browser; }
    public void setBrowser(String browser) { this.browser = browser; }

    public String getTrafficSource() { return trafficSource; }
    public void setTrafficSource(String trafficSource) { this.trafficSource = trafficSource; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
