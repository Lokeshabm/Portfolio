package com.lokesha.portfolio.model;

import java.util.List;

/**
 * Model representing aggregated project analytics summary and ranking statistics.
 */
public class ProjectStats {

    private int totalVisitors;
    private int totalProjectViews;
    private String mostViewedProject;
    private int mostViewedProjectCount;
    private int todayProjectViews;
    private List<ProjectRanking> mostViewedProjects;

    public ProjectStats() {}

    public ProjectStats(int totalVisitors, int totalProjectViews, String mostViewedProject,
                        int mostViewedProjectCount, int todayProjectViews,
                        List<ProjectRanking> mostViewedProjects) {
        this.totalVisitors = totalVisitors;
        this.totalProjectViews = totalProjectViews;
        this.mostViewedProject = mostViewedProject;
        this.mostViewedProjectCount = mostViewedProjectCount;
        this.todayProjectViews = todayProjectViews;
        this.mostViewedProjects = mostViewedProjects;
    }

    public int getTotalVisitors() { return totalVisitors; }
    public void setTotalVisitors(int totalVisitors) { this.totalVisitors = totalVisitors; }

    public int getTotalProjectViews() { return totalProjectViews; }
    public void setTotalProjectViews(int totalProjectViews) { this.totalProjectViews = totalProjectViews; }

    public String getMostViewedProject() { return mostViewedProject; }
    public void setMostViewedProject(String mostViewedProject) { this.mostViewedProject = mostViewedProject; }

    public int getMostViewedProjectCount() { return mostViewedProjectCount; }
    public void setMostViewedProjectCount(int mostViewedProjectCount) { this.mostViewedProjectCount = mostViewedProjectCount; }

    public int getTodayProjectViews() { return todayProjectViews; }
    public void setTodayProjectViews(int todayProjectViews) { this.todayProjectViews = todayProjectViews; }

    public List<ProjectRanking> getMostViewedProjects() { return mostViewedProjects; }
    public void setMostViewedProjects(List<ProjectRanking> mostViewedProjects) { this.mostViewedProjects = mostViewedProjects; }

    /**
     * Inner class representing individual project popularity ranking metrics.
     */
    public static class ProjectRanking {
        private int rank;
        private int projectId;
        private String projectName;
        private int totalViews;
        private int uniqueVisitors;
        private int todayViews;
        private int weeklyViews;
        private int cardViews;
        private int detailViews;
        private int githubClicks;
        private int liveDemoClicks;
        private double percentage;

        public ProjectRanking() {}

        public ProjectRanking(int rank, int projectId, String projectName, int totalViews,
                              int uniqueVisitors, int todayViews, int weeklyViews,
                              int cardViews, int detailViews, int githubClicks,
                              int liveDemoClicks, double percentage) {
            this.rank = rank;
            this.projectId = projectId;
            this.projectName = projectName;
            this.totalViews = totalViews;
            this.uniqueVisitors = uniqueVisitors;
            this.todayViews = todayViews;
            this.weeklyViews = weeklyViews;
            this.cardViews = cardViews;
            this.detailViews = detailViews;
            this.githubClicks = githubClicks;
            this.liveDemoClicks = liveDemoClicks;
            this.percentage = percentage;
        }

        public int getRank() { return rank; }
        public void setRank(int rank) { this.rank = rank; }

        public int getProjectId() { return projectId; }
        public void setProjectId(int projectId) { this.projectId = projectId; }

        public String getProjectName() { return projectName; }
        public void setProjectName(String projectName) { this.projectName = projectName; }

        public int getTotalViews() { return totalViews; }
        public void setTotalViews(int totalViews) { this.totalViews = totalViews; }

        public int getUniqueVisitors() { return uniqueVisitors; }
        public void setUniqueVisitors(int uniqueVisitors) { this.uniqueVisitors = uniqueVisitors; }

        public int getTodayViews() { return todayViews; }
        public void setTodayViews(int todayViews) { this.todayViews = todayViews; }

        public int getWeeklyViews() { return weeklyViews; }
        public void setWeeklyViews(int weeklyViews) { this.weeklyViews = weeklyViews; }

        public int getCardViews() { return cardViews; }
        public void setCardViews(int cardViews) { this.cardViews = cardViews; }

        public int getDetailViews() { return detailViews; }
        public void setDetailViews(int detailViews) { this.detailViews = detailViews; }

        public int getGithubClicks() { return githubClicks; }
        public void setGithubClicks(int githubClicks) { this.githubClicks = githubClicks; }

        public int getLiveDemoClicks() { return liveDemoClicks; }
        public void setLiveDemoClicks(int liveDemoClicks) { this.liveDemoClicks = liveDemoClicks; }

        public double getPercentage() { return percentage; }
        public void setPercentage(double percentage) { this.percentage = percentage; }
    }
}
