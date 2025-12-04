package com.showtime.onlinejudgecode.judge.config;

import com.showtime.onlinejudgecode.judge.entity.Example;
import com.showtime.onlinejudgecode.judge.entity.Problem;
import com.showtime.onlinejudgecode.judge.entity.TestCase;
import com.showtime.onlinejudgecode.judge.repository.ProblemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private final ProblemRepository problemRepository;

    public DataSeeder(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    @Override
    public void run(String... args) {
        if (problemRepository.count() == 0) {
            seedProblems();
        }
    }

    private void seedProblems() {

        Problem twoSum = new Problem();
        twoSum.setTitle("Two Sum");
        twoSum.setDescription(
                "Given an array of integers nums and an integer target, " +
                        "return indices of the two numbers such that they add up to target.\n\n" +
                        "Input Format:\n" +
                        "First line: space-separated integers (array)\n" +
                        "Second line: target integer\n\n" +
                        "Output Format:\n" +
                        "Two space-separated indices (0-based)"
        );
        twoSum.setDifficulty("EASY");
        twoSum.setTimeLimit(2000); // 2 seconds
        twoSum.setMemoryLimit(256000); // 256 MB
        twoSum.setCategory("Arrays");
        twoSum.setConstraints(List.of(
                "2 <= nums.length <= 10^4",
                "-10^9 <= nums[i] <= 10^9",
                "-10^9 <= target <= 10^9",
                "Only one valid answer exists."
        ));
        twoSum.setTags(List.of("Array", "Hash Table"));
        twoSum.setSolved(false);
        twoSum.setAttempts(0);
        twoSum.setExamples(List.of(
                buildExample("nums = [2,7,11,15], target = 9", "[0,1]", "Because nums[0] + nums[1] == 9"),
                buildExample("nums = [3,2,4], target = 6", "[1,2]", null)
        ));

        List<TestCase> twoSumTests = new ArrayList<>();

        TestCase tc1 = new TestCase();
        tc1.setProblem(twoSum);
        tc1.setInput("2 7 11 15\n9");
        tc1.setExpectedOutput("0 1");
        tc1.setHidden(false);
        twoSumTests.add(tc1);

        TestCase tc2 = new TestCase();
        tc2.setProblem(twoSum);
        tc2.setInput("3 2 4\n6");
        tc2.setExpectedOutput("1 2");
        tc2.setHidden(false);
        twoSumTests.add(tc2);

        TestCase tc3 = new TestCase();
        tc3.setProblem(twoSum);
        tc3.setInput("3 3\n6");
        tc3.setExpectedOutput("0 1");
        tc3.setHidden(true);
        twoSumTests.add(tc3);

        twoSum.setTestCases(twoSumTests);
        problemRepository.save(twoSum);

        // Problem 2: Palindrome Number
        Problem palindrome = new Problem();
        palindrome.setTitle("Palindrome Number");
        palindrome.setDescription(
                "Given an integer x, return true if x is palindrome integer.\n\n" +
                        "An integer is a palindrome when it reads the same backward as forward.\n\n" +
                        "Input Format:\n" +
                        "A single integer\n\n" +
                        "Output Format:\n" +
                        "true or false"
        );
        palindrome.setDifficulty("EASY");
        palindrome.setTimeLimit(1000);
        palindrome.setMemoryLimit(128000);
        palindrome.setCategory("Math");
        palindrome.setConstraints(List.of("-2^31 <= x <= 2^31 - 1"));
        palindrome.setTags(List.of("Math"));
        palindrome.setSolved(true);
        palindrome.setAttempts(1);
        palindrome.setExamples(List.of(
                buildExample("121", "true", null),
                buildExample("-121", "false", "Negative numbers are not palindromes")
        ));

        List<TestCase> palindromeTests = new ArrayList<>();

        TestCase pc1 = new TestCase();
        pc1.setProblem(palindrome);
        pc1.setInput("121");
        pc1.setExpectedOutput("true");
        pc1.setHidden(false);
        palindromeTests.add(pc1);

        TestCase pc2 = new TestCase();
        pc2.setProblem(palindrome);
        pc2.setInput("-121");
        pc2.setExpectedOutput("false");
        pc2.setHidden(false);
        palindromeTests.add(pc2);

        TestCase pc3 = new TestCase();
        pc3.setProblem(palindrome);
        pc3.setInput("10");
        pc3.setExpectedOutput("false");
        pc3.setHidden(true);
        palindromeTests.add(pc3);

        palindrome.setTestCases(palindromeTests);
        problemRepository.save(palindrome);

        // Problem 3: Fizz Buzz
        Problem fizzBuzz = new Problem();
        fizzBuzz.setTitle("Fizz Buzz");
        fizzBuzz.setDescription(
                "Given an integer n, return a string array answer (1-indexed) where:\n" +
                        "- answer[i] == \"FizzBuzz\" if i is divisible by 3 and 5\n" +
                        "- answer[i] == \"Fizz\" if i is divisible by 3\n" +
                        "- answer[i] == \"Buzz\" if i is divisible by 5\n" +
                        "- answer[i] == i (as a string) otherwise\n\n" +
                        "Input Format:\n" +
                        "A single integer n\n\n" +
                        "Output Format:\n" +
                        "Space-separated strings"
        );
        fizzBuzz.setDifficulty("EASY");
        fizzBuzz.setTimeLimit(1000);
        fizzBuzz.setMemoryLimit(128000);
        fizzBuzz.setCategory("Simulation");
        fizzBuzz.setConstraints(List.of("1 <= n <= 10^4"));
        fizzBuzz.setTags(List.of("Math", "String"));
        fizzBuzz.setSolved(false);
        fizzBuzz.setAttempts(2);
        fizzBuzz.setExamples(List.of(
                buildExample("3", "[1, 2, Fizz]", null),
                buildExample("5", "[1, 2, Fizz, 4, Buzz]", null)
        ));

        List<TestCase> fizzBuzzTests = new ArrayList<>();

        TestCase fb1 = new TestCase();
        fb1.setProblem(fizzBuzz);
        fb1.setInput("3");
        fb1.setExpectedOutput("1 2 Fizz");
        fb1.setHidden(false);
        fizzBuzzTests.add(fb1);

        TestCase fb2 = new TestCase();
        fb2.setProblem(fizzBuzz);
        fb2.setInput("5");
        fb2.setExpectedOutput("1 2 Fizz 4 Buzz");
        fb2.setHidden(false);
        fizzBuzzTests.add(fb2);

        TestCase fb3 = new TestCase();
        fb3.setProblem(fizzBuzz);
        fb3.setInput("15");
        fb3.setExpectedOutput("1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz");
        fb3.setHidden(true);
        fizzBuzzTests.add(fb3);

        fizzBuzz.setTestCases(fizzBuzzTests);
        problemRepository.save(fizzBuzz);

        System.out.println("✅ Seeded 3 sample problems with test cases");
    }

    private Example buildExample(String input, String output, String explanation) {
        Example example = new Example();
        example.setInput(input);
        example.setOutput(output);
        example.setExplanation(explanation);
        return example;
    }
}