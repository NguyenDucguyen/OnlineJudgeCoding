package com.showtime.onlinejudgecode.judge.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.showtime.onlinejudgecode.judge.entity.Certification;
import com.showtime.onlinejudgecode.judge.entity.Contest;
import com.showtime.onlinejudgecode.judge.entity.Problem;
import com.showtime.onlinejudgecode.judge.entity.TestCase;
import com.showtime.onlinejudgecode.judge.repository.CertificationRepository;
import com.showtime.onlinejudgecode.judge.repository.ContestRepository;
import com.showtime.onlinejudgecode.judge.repository.ProblemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProblemRepository problemRepository;
    private final ContestRepository contestRepository;
    private final CertificationRepository certificationRepository;
    private final ObjectMapper objectMapper;
    private final ResourceLoader resourceLoader;

    @Override
    public void run(String... args) {
        if (problemRepository.count() == 0) {
            seedProblems();
        }
        if (contestRepository.count() == 0) {
            seedContests();
        }
        if (certificationRepository.count() == 0) {
            seedCertifications();
        }
    }

    private void seedProblems() {
        Resource resource = resourceLoader.getResource("classpath:problems.json");
        if (!resource.exists()) {
            log.warn("No problems.json found on classpath; skipping default seed");
            return;
        }

        try (InputStream inputStream = resource.getInputStream()) {
            List<ProblemSeed> seeds = objectMapper.readValue(inputStream, new TypeReference<>() {
            });

            seeds.forEach(seed -> {
                Problem problem = new Problem();
                problem.setTitle(seed.title());
                problem.setDescription(seed.description());
                problem.setDifficulty(seed.difficulty());
                problem.setTimeLimit(seed.timeLimit());
                problem.setMemoryLimit(seed.memoryLimit());

                List<TestCase> testCases = seed.testCases().stream()
                        .map(testSeed -> {
                            TestCase testCase = new TestCase();
                            testCase.setInput(testSeed.input());
                            testCase.setExpectedOutput(testSeed.expectedOutput());
                            testCase.setHidden(Boolean.TRUE.equals(testSeed.hidden()));
                            testCase.setProblem(problem);
                            return testCase;
                        })
                        .toList();

                problem.setTestCases(testCases);
                problemRepository.save(problem);
            });

            log.info("✅ Seeded {} problems from problems.json", seeds.size());
        } catch (IOException e) {
            log.error("Failed to seed problems from problems.json", e);
        }
    }

    private void seedContests() {
        List<Problem> problems = problemRepository.findAll();

        Contest weeklyContest = new Contest();
        weeklyContest.setTitle("Weekly Contest 375");
        weeklyContest.setType("Weekly");
        weeklyContest.setStartTime(LocalDateTime.now().plusDays(3));
        weeklyContest.setDurationMinutes(90);
        weeklyContest.setParticipantCount(8500);
        weeklyContest.setDifficulty("All Levels");
        weeklyContest.setStatus("upcoming");
        weeklyContest.setPrizes(List.of("$500", "$300", "$200"));
        weeklyContest.setProblems(selectProblems(problems, 0, 3));

        Contest algorithmChallenge = new Contest();
        algorithmChallenge.setTitle("Algorithm Master Challenge");
        algorithmChallenge.setType("Special");
        algorithmChallenge.setStartTime(LocalDateTime.now().plusDays(5));
        algorithmChallenge.setDurationMinutes(180);
        algorithmChallenge.setParticipantCount(15200);
        algorithmChallenge.setDifficulty("Advanced");
        algorithmChallenge.setStatus("upcoming");
        algorithmChallenge.setPrizes(List.of("$2000", "$1000", "$500"));
        algorithmChallenge.setProblems(selectProblems(problems, 1, 4));

        Contest weeklyPast = new Contest();
        weeklyPast.setTitle("Weekly Contest 374");
        weeklyPast.setType("Weekly");
        weeklyPast.setStartTime(LocalDateTime.now().minusDays(10));
        weeklyPast.setEndTime(LocalDateTime.now().minusDays(9));
        weeklyPast.setDurationMinutes(90);
        weeklyPast.setParticipantCount(9200);
        weeklyPast.setDifficulty("All Levels");
        weeklyPast.setStatus("completed");
        weeklyPast.setProblems(selectProblems(problems, 2, 3));

        contestRepository.saveAll(List.of(weeklyContest, algorithmChallenge, weeklyPast));
        log.info("✅ Seeded {} contests", contestRepository.count());
    }

    private List<Problem> selectProblems(List<Problem> available, int offset, int desiredCount) {
        if (available == null || available.isEmpty()) {
            log.warn("No problems available to assign to contests");
            return List.of();
        }

        int total = available.size();
        int count = Math.min(desiredCount, total);
        List<Problem> selected = new ArrayList<>(count);

        for (int i = 0; i < count; i++) {
            selected.add(available.get((offset + i) % total));
        }

        return selected;
    }

    private void seedCertifications() {
        Certification javascript = buildCertification(
                "JavaScript (Basic)",
                "Test your basic JavaScript skills including variables, functions, and control structures",
                45,
                15,
                12500,
                "Basic"
        );

        Certification python = buildCertification(
                "Python (Intermediate)",
                "Demonstrate intermediate Python knowledge including OOP, data structures, and algorithms",
                75,
                20,
                8200,
                "Intermediate"
        );

        Certification dataStructures = buildCertification(
                "Data Structures",
                "Prove your understanding of arrays, linked lists, trees, graphs, and hash tables",
                90,
                25,
                15300,
                "Advanced"
        );

        Certification algorithms = buildCertification(
                "Algorithms",
                "Test your algorithmic thinking with sorting, searching, and optimization problems",
                90,
                25,
                9800,
                "Advanced"
        );

        Certification sql = buildCertification(
                "SQL (Basic)",
                "Demonstrate basic SQL skills including SELECT, JOIN, GROUP BY, and filtering",
                60,
                18,
                20100,
                "Basic"
        );

        Certification react = buildCertification(
                "React (Intermediate)",
                "Test your React knowledge including hooks, state management, and component lifecycle",
                75,
                20,
                6700,
                "Intermediate"
        );

        certificationRepository.saveAll(List.of(javascript, python, dataStructures, algorithms, sql, react));
        log.info("✅ Seeded {} certifications", certificationRepository.count());
    }

    private Certification buildCertification(String title, String description, Integer duration, Integer questions, Integer participants, String difficulty) {
        Certification certification = new Certification();
        certification.setTitle(title);
        certification.setDescription(description);
        certification.setDurationMinutes(duration);
        certification.setQuestionCount(questions);
        certification.setParticipantCount(participants);
        certification.setDifficulty(difficulty);
        certification.setPassingScore(70.0);
        return certification;
    }

    private record ProblemSeed(
            String title,
            String description,
            String difficulty,
            Integer timeLimit,
            Integer memoryLimit,
            List<TestCaseSeed> testCases
    ) {
    }

    private record TestCaseSeed(
            String input,
            String expectedOutput,
            Boolean hidden
    ) {
    }
}
