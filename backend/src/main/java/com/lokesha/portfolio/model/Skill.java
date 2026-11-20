package com.lokesha.portfolio.model;

import java.util.List;

public class Skill {
    private String category;
    private String icon;
    private List<SkillItem> items;

    public Skill() {}

    public Skill(String category, String icon, List<SkillItem> items) {
        this.category = category;
        this.icon = icon;
        this.items = items;
    }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public List<SkillItem> getItems() { return items; }
    public void setItems(List<SkillItem> items) { this.items = items; }

    public static class SkillItem {
        private String name;
        private int level; // percentage (0 - 100)
        private String experience; // e.g., "Intermediate", "Advanced"

        public SkillItem() {}

        public SkillItem(String name, int level, String experience) {
            this.name = name;
            this.level = level;
            this.experience = experience;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public int getLevel() { return level; }
        public void setLevel(int level) { this.level = level; }

        public String getExperience() { return experience; }
        public void setExperience(String experience) { this.experience = experience; }
    }
}
