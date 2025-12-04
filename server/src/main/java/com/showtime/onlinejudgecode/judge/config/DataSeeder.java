package com.showtime.onlinejudgecode.judge.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.showtime.onlinejudgecode.judge.entity.Problem;
import com.showtime.onlinejudgecode.judge.entity.TestCase;
import com.showtime.onlinejudgecode.judge.repository.ProblemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProblemRepository problemRepository;
    private final ObjectMapper objectMapper;
    private final ResourceLoader resourceLoader;

    @Override
    public void run(String... args) {
        if (problemRepository.count() == 0) {
            seedProblems();
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
