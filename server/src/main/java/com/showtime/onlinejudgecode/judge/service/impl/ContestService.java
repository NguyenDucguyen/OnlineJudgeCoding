package com.showtime.onlinejudgecode.judge.service.impl;

import com.showtime.onlinejudgecode.judge.dto.request.ContestRegistrationRequest;
import com.showtime.onlinejudgecode.judge.dto.request.ContestRequest;
import com.showtime.onlinejudgecode.judge.entity.Contest;
import com.showtime.onlinejudgecode.judge.entity.ContestRegistration;
import com.showtime.onlinejudgecode.judge.entity.Problem;
import com.showtime.onlinejudgecode.judge.repository.ContestRegistrationRepository;
import com.showtime.onlinejudgecode.judge.repository.ContestRepository;
import com.showtime.onlinejudgecode.judge.repository.ProblemRepository;
import com.showtime.onlinejudgecode.judge.service.IContestService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ContestService implements IContestService {

    private final ContestRepository contestRepository;
    private final ContestRegistrationRepository contestRegistrationRepository;
    private final ProblemRepository problemRepository;

    public ContestService(ContestRepository contestRepository,
                          ContestRegistrationRepository contestRegistrationRepository,
                          ProblemRepository problemRepository) {
        this.contestRepository = contestRepository;
        this.contestRegistrationRepository = contestRegistrationRepository;
        this.problemRepository = problemRepository;
    }

    @Override
    public List<Contest> getAllContests() {
        return contestRepository.findAll();
    }

    @Override
    public Contest getContestById(Long id) {
        return contestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Contest not found with id " + id));
    }

    @Override
    public Contest createContest(ContestRequest request) {
        Contest contest = new Contest();
        mapContestFields(contest, request);
        return contestRepository.save(contest);
    }

    @Override
    public Contest updateContest(Long id, ContestRequest request) {
        Contest existing = getContestById(id);
        mapContestFields(existing, request);
        return contestRepository.save(existing);
    }

    @Override
    public void deleteContest(Long id) {
        contestRepository.deleteById(id);
    }

    @Override
    @Transactional
    public ContestRegistration registerForContest(Long contestId, ContestRegistrationRequest request) {
        if (request.getUserId() == null || request.getUserId().isBlank()) {
            throw new IllegalArgumentException("User id is required to register for a contest");
        }
        Contest contest = getContestById(contestId);

        if (contestRegistrationRepository.existsByContestIdAndUserId(contestId, request.getUserId())) {
            throw new IllegalArgumentException("User already registered for this contest");
        }

        ContestRegistration registration = new ContestRegistration();
        registration.setContest(contest);
        registration.setUserId(request.getUserId());
        registration.setRegisteredAt(LocalDateTime.now());

        ContestRegistration saved = contestRegistrationRepository.save(registration);

        Integer participants = contest.getParticipantCount() != null ? contest.getParticipantCount() : 0;
        contest.setParticipantCount((int) (participants + 1));
        contestRepository.save(contest);

        return saved;
    }

    @Override
    public List<ContestRegistration> getRegistrations(Long contestId) {
        getContestById(contestId);
        return contestRegistrationRepository.findByContestId(contestId);
    }

    @Override
    public List<Problem> getContestProblems(Long contestId) {
        Contest contest = getContestById(contestId);
        return contest.getProblems();
    }

    private void mapContestFields(Contest contest, ContestRequest request) {
        contest.setTitle(request.getTitle());
        contest.setType(request.getType());
        contest.setStartTime(request.getStartTime());
        contest.setEndTime(request.getEndTime());
        contest.setDurationMinutes(request.getDurationMinutes());
        contest.setParticipantCount(request.getParticipantCount());
        contest.setDifficulty(request.getDifficulty());
        contest.setStatus(request.getStatus());
        contest.setPrizes(request.getPrizes());

        if (request.getProblemIds() != null) {
            Set<Long> requestedIds = request.getProblemIds().stream().collect(Collectors.toSet());
            List<Problem> problems = new ArrayList<>();

            if (!requestedIds.isEmpty()) {
                List<Problem> found = problemRepository.findAllById(requestedIds);

                if (found.size() != requestedIds.size()) {
                    throw new IllegalArgumentException("One or more problem IDs are invalid");
                }

                problems.addAll(found);
            }

            contest.setProblems(problems);
        }
    }
}
