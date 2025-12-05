# Submission flow example test cases

These scenarios illustrate how the submission pipeline behaves end to end. They can be copied into API documentation or used as smoke tests against `/api/submissions`.

## Prerequisites
- Start the Spring Boot server with the default seed data so the problems in `server/src/main/resources/problems.json` are available.
- Obtain a valid Judge0 `language_id` (e.g., `71` for Python 3.11) and adjust `problemId` to match the seeded row in your database.
- The `SubmissionRequest` payload expects `problemId`, `language_id`, `source_code`, and an optional `userId`.

## Quick reference table

| Scenario | Problem | Sample language | Expected outcome |
| --- | --- | --- | --- |
| AC path | Palindrome Number | Python 3 | All test cases pass, status `ACCEPTED`, `passedTestCases == totalTestCases` |
| Wrong answer | Fizz Buzz | Python 3 | At least one test fails, status `WRONG_ANSWER`, decoded stdout is stored |
| Runtime error | Two Sum | Python 3 | Runtime failure reported by Judge0, status becomes `WRONG_ANSWER`, error message captured |
| Compile error | Palindrome Number | Python 3 | Compile-time failure reported by Judge0, status becomes `WRONG_ANSWER`, compiler output captured |
| Empty Judge0 status/time | Any | Python 3 | Missing status/time does not throw NPE; response still returns score/passed counters |

## Detailed examples

### 1) Accepted path (Palindrome Number)
```bash
curl -X POST http://localhost:8080/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
        "problemId": 2,
        "language_id": 71,
        "source_code": "x=int(input().strip());print(str(x)==str(x)[::-1])"
      }'
```

Expected response shape:
- `status`: `ACCEPTED`
- `passedTestCases` equals `totalTestCases` (4 with the default seed)
- `score` is 100

### 2) Wrong answer (Fizz Buzz)
A minimal but incorrect solution only prints the number.
```bash
curl -X POST http://localhost:8080/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
        "problemId": 3,
        "language_id": 71,
        "source_code": "n=int(input());print('"'"' '.join(str(i) for i in range(1,n+1)))"
      }'
```

Expected response shape:
- `status`: `WRONG_ANSWER` (any non-AC status is collapsed to `WRONG_ANSWER` by the service)
- `passedTestCases` is less than `totalTestCases`
- `output` holds the decoded stdout from the first failing Judge0 test case

### 3) Runtime error (Two Sum)
Force an exception to check error capture.
```bash
curl -X POST http://localhost:8080/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
        "problemId": 1,
        "language_id": 71,
        "source_code": "raise ZeroDivisionError('"'"'boom'"'"')"
      }'
```

Expected response shape:
- `status`: `WRONG_ANSWER`
- `errorMessage`: includes the runtime traceback returned by Judge0
- `runtime`: still computed from available Judge0 timings (0 if Judge0 omits timing)

### 4) Compile error (Palindrome Number)
Submit syntactically invalid code to verify compiler output is surfaced.
```bash
curl -X POST http://localhost:8080/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
        "problemId": 2,
        "language_id": 71,
        "source_code": "def is_pal(x) print(True)"
      }'
```

Expected response shape:
- `status`: `WRONG_ANSWER`
- `errorMessage`: contains the compiler diagnostics decoded from Judge0 output

### 5) Missing Judge0 status/time regression check
To guard against null status or timing fields, temporarily stub `Judge0Service.waitForResult` to return a `Judge0Response` with `status == null` and `time == null`. Submit any trivial program, then assert:
- the service returns a response instead of throwing
- `passedTestCases` counts accepted cases only when `status.id == 3`
- `runtime` defaults to `0` when Judge0 omits timing information

These cases mirror the service logic that decodes the first failing stdout/stderr, collapses non-AC statuses to `WRONG_ANSWER`, and safely averages null timings, ensuring the submit flow remains stable even with partial Judge0 responses.
