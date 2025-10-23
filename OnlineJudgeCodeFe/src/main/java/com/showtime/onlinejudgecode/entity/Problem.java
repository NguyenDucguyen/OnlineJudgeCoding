package com.showtime.onlinejudgecode.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "problem")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "input", nullable=false)
    private String input;
    @Column(name = "output", nullable=false)
    private String output;
    @Column(name = "type", nullable=false)
    private ProblemType type;
    @Column(name = "description", nullable=false)
    private String description;
    @Column(name = "title", nullable=false)
    private String title;
    @Column(name="constraints", nullable=false)
    private String constraints;

    @Override
    public String toString() {
        return "Problem{" +
                "id=" + id +
                ", input='" + input + '\'' +
                ", output='" + output + '\'' +
                ", type=" + type +
                ", description='" + description + '\'' +
                ", title='" + title + '\'' +
                ", constraints='" + constraints + '\'' +
                '}';
    }
}
